import dotenv from "dotenv";
import path from "path";
import * as fs from "fs";
import mysqlClient from "../../infrastructure/database/mysql/mysql-client.js";

dotenv.config();

const __dirname = path.resolve();

export async function migrationRunner() {
    const migrationsPath = path.join(__dirname, "src/presentation/migrations/scripts");
    const allFiles = fs.readdirSync(migrationsPath);
    
    // Separar archivos por tipo y ordenarlos
    const tableFiles = allFiles
        .filter(file => /^\d/.test(file)) // Solo archivos que comiencen con dígitos
        .sort((a, b) => {
            // Extraer el número al inicio del nombre del archivo
            const numA = parseInt(a.match(/^(\d+)/)[1]);
            const numB = parseInt(b.match(/^(\d+)/)[1]);
            return numA - numB; // Ordenar numéricamente
        });

    const storedProcedureFiles = allFiles
        .filter(file => file.startsWith('sp_'))
        .sort(); // Ordenar alfabéticamente

    const viewFiles = allFiles
        .filter(file => file.startsWith('view_'))
        .sort(); // Ordenar alfabéticamente

    const seedFiles = allFiles
        .filter(file => file.startsWith('seed_'))
        .sort(); // Ordenar alfabéticamente

    console.log(`📊 Migration Summary:`);
    console.log(`  📋 Tables: ${tableFiles.length} files`);
    console.log(`  🔧 Stored Procedures: ${storedProcedureFiles.length} files`);
    console.log(`  👁️  Views: ${viewFiles.length} files`);
    console.log(`  🌱 Seeds: ${seedFiles.length} files`);
    console.log(`  📝 Total: ${tableFiles.length + storedProcedureFiles.length + viewFiles.length + seedFiles.length} files\n`);

    await mysqlClient.connect();

    async function runMigrations() {
        // Deshabilitar verificaciones de foreign keys
        console.log('🔧 Disabling foreign key checks...');
        await mysqlClient.query('SET FOREIGN_KEY_CHECKS = 0');

        try {
            // 1. Ejecutar tablas primero
            if (tableFiles.length > 0) {
                console.log('\n📋 === EXECUTING TABLES ===');
                await executeFiles(tableFiles, 'Table');
            }

            // 2. Ejecutar stored procedures
            if (storedProcedureFiles.length > 0) {
                console.log('\n🔧 === EXECUTING STORED PROCEDURES ===');
                await executeFiles(storedProcedureFiles, 'Stored Procedure');
            }

            // 3. Ejecutar vistas
            if (viewFiles.length > 0) {
                console.log('\n👁️ === EXECUTING VIEWS ===');
                await executeFiles(viewFiles, 'View');
            }

            // 4. Ejecutar seeds al final
            if (seedFiles.length > 0) {
                console.log('\n🌱 === EXECUTING SEEDS ===');
                await executeFiles(seedFiles, 'Seed');
            }

        } finally {
            // Re-habilitar verificaciones de foreign keys
            console.log('\n� Re-enabling foreign key checks...');
            await mysqlClient.query('SET FOREIGN_KEY_CHECKS = 1');
        }
    }

    async function executeFiles(files, type) {
        for (const file of files) {
            try {
                console.log(`\n🔄 Running ${type}: ${file}`);
                const migration = await fs.promises.readFile(path.join(migrationsPath, file), "utf-8");
                
                // Para stored procedures, manejar de forma especial
                if (type === 'Stored Procedure') {
                    // Limpiar el contenido del SP: remover delimitadores
                    let content = migration
                        .replace(/DELIMITER\s+\$\$/gi, '') // Remover DELIMITER $$
                        .replace(/DELIMITER\s+;/gi, '')    // Remover DELIMITER ;
                        .trim();

                    // Buscar y ejecutar DROP PROCEDURE primero
                    const dropMatch = content.match(/DROP PROCEDURE IF EXISTS[^$]*?\$\$/i);
                    if (dropMatch) {
                        const dropCommand = dropMatch[0].replace(/\$\$/g, '').trim();
                        console.log(`   📝 Executing DROP: ${dropCommand.substring(0, 50)}...`);
                        await mysqlClient.query(dropCommand);
                    }

                    // Buscar y ejecutar CREATE PROCEDURE (desde CREATE hasta END $$)
                    const createMatch = content.match(/CREATE PROCEDURE[\s\S]*?END\s*\$\$/i);
                    if (createMatch) {
                        const createCommand = createMatch[0].replace(/\$\$/g, '').trim();
                        console.log(`   📝 Executing CREATE: ${createCommand.substring(0, 50)}...`);
                        await mysqlClient.query(createCommand);
                    }
                } else {
                    // Para tablas, vistas y seeds, dividir por statements
                    // Mejorar el split para manejar mejor los multiline statements
                    const lines = migration.split('\n');
                    let currentStatement = '';
                    const statements = [];

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        
                        // Ignorar líneas de comentarios completas
                        if (trimmedLine.startsWith('--') || trimmedLine === '') {
                            // Si hay un statement actual y encontramos un comentario o línea vacía,
                            // y el statement anterior terminaba en ;, guardarlo
                            if (currentStatement.trim() && currentStatement.trim().endsWith(';')) {
                                statements.push(currentStatement.trim());
                                currentStatement = '';
                            }
                            continue;
                        }

                        // Remover comentarios inline (-- al final de la línea)
                        let cleanLine = line;
                        const commentIndex = line.indexOf('--');
                        if (commentIndex !== -1) {
                            cleanLine = line.substring(0, commentIndex).trim();
                        }

                        if (cleanLine.trim()) {
                            currentStatement += cleanLine + '\n';

                            // Si la línea termina con ;, es el final del statement
                            if (cleanLine.trim().endsWith(';')) {
                                statements.push(currentStatement.trim());
                                currentStatement = '';
                            }
                        }
                    }

                    // Si queda un statement sin terminar, agregarlo
                    if (currentStatement.trim()) {
                        statements.push(currentStatement.trim());
                    }

                    // Ejecutar cada statement por separado
                    for (const statement of statements) {
                        if (statement.trim()) {
                            console.log(`   📝 Executing: ${statement.substring(0, 50).replace(/\s+/g, ' ')}...`);
                            await mysqlClient.query(statement);
                        }
                    }
                }
                
                console.log(`✅ ${type} ${file} executed successfully`);
            } catch (error) {
                console.error(`❌ Error executing ${type} ${file}:`, error);
                throw error; // Re-lanzar el error para detener la ejecución
            }
        }
    }

    runMigrations()
        .then(() => {
            console.log("\n🎉 All migrations executed successfully.");
            process.exit(0);
        })
        .catch((error) => {
            console.error("\n💥 Error executing migrations:", error);
            process.exit(1);
        });
}

await migrationRunner();