const queries = require('../db/queries')
const BadRequestException = require('../errors/BadRequest')
const appConfigs = require('../configs/app.json')

module.exports = app => {

    // RETURN ALL THE APPROVED STUDENTS 
    app.get('/student/approveds', async (req, res) => {
        const selectStructure = {
            where: [`finalGrade >= ${appConfigs.APPROVAL_GRADE}`]
        }
        const approvedStudents = await queries.select('student_final_grade', selectStructure)
        res.json(approvedStudents)
    })

    // RETURN THE GRADES OF EACH TEST OF A SPECIFIC STUDENT
    app.get('/student/:id/grades', async (req, res) => {
        const studentId = req.params.id
        // student_grade is a view of the database that calculates all the grades of each test and student
        const result = await queries.fetchFilter('student_grade', {studentId})
        if (result.length === 0) {
            throw new BadRequestException(`Student with id ${studentId} doens't exist or doesn't have awnsered any test.`)
        }
        res.json(result)
    })

    // RETURN THE FINAL GRADE OF A SPECIFIC STUDENT
    app.get('/student/:id/final_grade', async (req, res) => {
        const studentId = req.params.id
        const selectStructure = {
            select: {
                studentId: 'studentId',
                finalGrade: 'avg(grade)'
            },
            where: [`studentId = ${studentId}`]
        }
        const result = await queries.select('student_grade', selectStructure)
        if (result.length === 0) {
            throw new BadRequestException(`Student with id ${studentId} doens't exist or doesn't have awnsered any test.`)
        }
        res.json(result[0])
    })

    // CREATES OR REPLACE THE AWNSERS OF A SPECIFIC STUDENT TO A SPECIFIC TEST
    app.post('/student/:id/awnsers', async (req, res) => {

        const studentId = req.params.id
        const student = await queries.get('student', studentId)
        if (student === {}) {
            throw new BadRequestException(`Student with id ${studentId} not found.`)
        }

        const { exam, awnsers } = req.body

        const examResult = await queries.getFirstColumnMatch('exam', exam, ['id', 'name'])

        if (!examResult) {
            throw new BadRequestException(`Exam: ${exam} not found.`)
        }
        const examId = examResult.id

        const selectStudentAwnsers = {
            join: [{
                type: 'inner',
                table: 'exam_awnser',
                on: `exam_awnser.id = student_awnser.examAwnserId`,
            }],
            where: [
                `student_awnser.studentId = ${studentId}`,
                `exam_awnser.examId = ${examId}`
            ],
        }

        const correctAwnsers = await queries.fetchFilter('exam_awnser', { examId })
        if (correctAwnsers.length === 0) {
            throw new BadRequestException(`Exam: ${exam} has no awsers.`)
        }
        if (correctAwnsers.length !== awnsers.length) {
            throw new BadRequestException(`Expected ${correctAwnsers.length} awnsers, received ${awnsers.length}. If the student have not awnsered some questions, please fill it with "null" values. Example: ["A", null, "B", "C", null, null].`)
        }
        // Checks if old awnsers exists, and deletes then
        const studentOldAwnsers = await queries.select('student_awnser', selectStudentAwnsers)
        if (studentOldAwnsers.length !== 0) {
            await Promise.all(studentOldAwnsers.map(oldAwnser => queries.delete('student_awnser', oldAwnser.id)))
        }

        await Promise.all(correctAwnsers.map((correctAwnser, i) => {
            const awnser = awnsers[i]
            const examAwnserId = correctAwnser.id
            return queries.insert('student_awnser', {
                examAwnserId,
                studentId,
                awnser
            })
        }))
        const studentNewAwnsers = await queries.select('student_awnser', selectStudentAwnsers)
        res.json(studentNewAwnsers)
    })

    // RETURNS A SPECIFIC STUDENT
    app.get('/student/:id', async (req, res) => {

        const id = req.params.id
        const student = await queries.get('student', id)
        res.json(student)
    })

    // DELETES A SPECIFIC STUDENT
    app.delete('/student/:id', async (req, res) => {
        const id = req.params.id
        const result = await queries.delete('student', id)
        res.json(result)
    })

    // CREATES A NEW STUDENT
    app.post('/student', async (req, res) => {
        const student = req.body
        const studentTotal = await queries.count('student')
        if (studentTotal >= appConfigs.MAX_STUDENTS) {
            throw new BadRequestException(`Max number of students reached: ${appConfigs.MAX_STUDENTS}`)
        }
        const id = await queries.insert('student', student)
        const newStudent = await queries.get('student', id)
        res.json(newStudent)

    })

    // RETURNS ALL STUDENTS
    app.get('/student', async (req, res) => {
        const students = await queries.fetchAll('student')
        res.json(students)
    })



}