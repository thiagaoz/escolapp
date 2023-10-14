import db from './SQLiteDB'
import {IAluno, IMateria} from '../models/models'
import { SQLError, SQLResultSetRowList } from 'expo-sqlite';

db.transaction((tx) => {
    // derruba tabebla
    // usado só nos testes
    tx.executeSql('CREATE TABLE IF NOT EXISTS alunos (aluno_id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT');
    console.log(' --- TABELAS ALUNOS CRIADA ---')
})

const createAlunoTable = () : Promise<void>=> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS alunos (aluno_id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)',
          [],
          () => {
            console.log(' --- TABELA ALUNOS CRIADA ---');
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
  

const dropAlunoTable = () => { 
    db.transaction((tx) => {
        tx.executeSql('DROP TABLE alunos;');
        console.log(' --- TABELAS ALUNOS DELETADA ---')
      })
}

const create = (aluno:IAluno): Promise<number>=> { 
    return new Promise ((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO alunos (nome) values (?);',
            [aluno.nome],
            //-------------------------
            (tx, result) => {
                const { rowsAffected, insertId } = result;
                if (rowsAffected > 0) {
                    resolve(insertId as number);
                } else {
                    reject(new Error('Erro ao inserir o aluno: ' + JSON.stringify(aluno)));
                }
            },
            (_: any, error: SQLError) => {
                // Handle the error
                console.error('SQL Error adicionando aluno:', error);
                return true; // Rollback the transaction
            }
        )
        })
    })
}

const update = (aluno_id:number, aluno:IAluno) : Promise<number> => { 
    return new Promise((resolve, reject)=> {
        if (aluno_id === undefined) {
            reject('Invalid id provided.');
            return;
        }
        db.transaction((tx)=>{
            tx.executeSql('UPDATE alunos SET nome=?, WHERE aluno_id=?;',
            [aluno.nome, aluno_id],
            //------------------
            (_, {rowsAffected}) => {
                if (rowsAffected > 0) resolve(rowsAffected)
                else reject('Erro ao atualizar o aluno: ' + JSON.stringify(aluno));
            }
            ,
            (_: any, error: SQLError) => {
                // Handle the error
                console.error('SQL Error updating aluno:', error);
                return true; // Rollback the transaction
            }
        )
        })
    })
}

const all = () : Promise<IAluno[]>=> { 
    return new Promise ((resolve, reject)=>{
        db.transaction((tx)=> {
            tx.executeSql('SELECT * FROM alunos;',
            [],
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

const getMaterias = async (aluno_id: number): Promise<IMateria[]> => { 
    return new Promise ((resolve, reject)=>{
        db.transaction((tx)=> {
            tx.executeSql(
                `SELECT * FROM materias
                LEFT JOIN matriculas ON matriculas.materia_id = materias.materia_id
                WHERE matriculas.aluno_id = ?`,
                [aluno_id],
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

const remove = (aluno_id:number) : Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx)=>{
            tx.executeSql('DELETE FROM alunos WHERE aluno_id=?;',
            [aluno_id],
            //----------------------------
            (_, {rowsAffected}) => {
                resolve(rowsAffected)
            },
            (_, error : SQLError) => {
                console.error('SQL Error deletando aluno', error);
                return true
            }
            )
        })
    })
}

export default { create, update, all, remove, createAlunoTable, dropAlunoTable, getMaterias }