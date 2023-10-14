import db from './SQLiteDB'
import {IAluno, IMateria} from '../models/models'
import { SQLError, SQLResultSetRowList } from 'expo-sqlite';

const createMateriaTable = () : Promise<void>=> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS materias (materia_id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, abreviatura TEXT)',
          [],
          () => {
            console.log(' --- TABELA MATERIAS CRIADA ---');
            resolve();
          },
          (_: any, error: SQLError) => {
            // Handle the error
            console.error('SQL Erro criando TABLE:', error);
            return true; // Rollback the transaction
        }
        );
      });
    });
  };
  

const dropMateriaTable = () => { 
    db.transaction((tx) => {
        tx.executeSql('DROP TABLE materias;');
        console.log(' --- TABELAS MATERIAS DELETADA ---')
      })
}

const create = (materia:IMateria): Promise<number>=> { 
    return new Promise ((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO materias (nome, abreviatura) values (?, ?);',
            [materia.nome, materia.abreviatura],
            //-------------------------
            (tx, result) => {
                const { rowsAffected, insertId } = result;
                if (rowsAffected > 0) {
                    resolve(insertId as number);
                } else {
                    reject(new Error('Erro ao inserir a materia : ' + JSON.stringify(materia)));
                }
            },
            (_: any, error: SQLError) => {
                // Handle the error
                console.error('SQL Error adicionando materia:', error);
                return true; // Rollback the transaction
            }
        )
        })
    })
}

const update = (materia_id:number, materia:IMateria) : Promise<number> => { 
    return new Promise((resolve, reject)=> {
        if (materia_id === undefined) {
            reject('Invalid id provided.');
            return;
        }
        db.transaction((tx)=>{
            tx.executeSql('UPDATE materias SET nome=? abreviatura=? WHERE materia_id=?;',
            [materia.nome, materia.abreviatura, materia_id],
            //------------------
            (_, {rowsAffected}) => {
                if (rowsAffected > 0) resolve(rowsAffected)
                else reject('Erro ao atualizar o aluno: ' + JSON.stringify(materia));
            }
            ,
            (_: any, error: SQLError) => {
                // Handle the error
                console.error('SQL Error updating materia:', error);
                return true; // Rollback the transaction
            }
        )
        })
    })
}

const all = () : Promise<IMateria[]>=> { 
    return new Promise ((resolve, reject)=>{
        db.transaction((tx)=> {
            tx.executeSql('SELECT * FROM materias;',
            [],
            //---------------------
            (_ : any, {rows}) => resolve(rows._array),
            (_, error : SQLError) => {
                console.error('SQL Error getting all materias:', error);
                return true
            }
            )
        })
    })
}

const getAlunos = async (materia_id: number): Promise<IAluno[]> => { 
    return new Promise ((resolve, reject)=>{
        db.transaction((tx)=> {
            tx.executeSql(
                `SELECT * FROM alunos
                LEFT JOIN matriculas ON matriculas.aluno_id = alunos.aluno_id
                WHERE matriculas.materia_id = ?`,
                [materia_id],
                //---------------------
                (_ : any, {rows}) => resolve(rows._array),
                (_, error : SQLError) => {
                    console.error('SQL Error getting all alunos:', error);
                    return true
                }
            )
        })
    })
}

const remove = (materia_id:number) : Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx)=>{
            tx.executeSql('DELETE FROM materias WHERE materia_id=?;',
            [materia_id],
            //----------------------------
            (_, {rowsAffected}) => {
                resolve(rowsAffected)
            },
            (_, error : SQLError) => {
                console.error('SQL Error deletando materia', error);
                return true
            }
            )
        })
    })
}

export default { create, update, all, remove, createMateriaTable, dropMateriaTable, getAlunos }