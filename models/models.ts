export interface IAluno {
    aluno_id?: number,
    nome: string,
    materias?: number[]
}

export interface IMateria {
    materia_id?: number,
    nome: string,
    abreviatura: string,
    alunos?: number[]
}