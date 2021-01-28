const queries = require('../db/queries')
const { exception } = require('console')
const BadRequestException = require('../errors/BadRequest')


module.exports = app => {

    // UPDATE AWNSERS OF A SPECIFIC EXAM
    app.put('/exam/:id/awnsers', async (req, res) => {
        const examId = req.params.id
        const newAwnsers = req.body.awnsers
        if(newAwnsers.length === 0) {
            throw new BadRequestException('Exam must have at least 1 awnser.')
        }
        const oldAwnsers = await queries.fetchFilter('exam_awnser', { examId })
        await Promise.all(oldAwnsers.map(awnser => queries.delete('exam_awnser', awnser.id)))
        await Promise.all(newAwnsers.map(({ awnser, weight }) => queries.insert('exam_awnser', { examId, awnser, weight: weight > 0 ? weight : 1 })))
        const awnsers = await queries.fetchFilter('exam_awnser', { examId })
        res.json(awnsers)
    })

    // RETURNS THE AWNSERS OF A SPECIFIC EXAM
    app.get('/exam/:id/awnsers', async (req, res) => {
        const examId = req.params.id
        const awnsers = await queries.fetchFilter('exam_awnser', { examId })
        res.json(awnsers)
    })

    // RETURNS A SPECIFIC EXAM
    app.get('/exam/:id', async (req, res) => {
        const id = req.params.id
        const exam = await queries.get('exam', id)
        res.json(exam)
    })

    // DELETES A SPECIFIC EXAM
    app.delete('/exam/:id', async (req, res) => {
        const id = req.params.id
        const result = await queries.delete('exam', id)
        res.json(result)
    })

    // RETURNS ALL EXAMS
    app.get('/exam', async (req, res) => {
        const exams = await queries.fetchAll('exam')
        res.json(exams)
    })

    // CREATES A NEW EXAM WITH ITS AWNSERS
    app.post('/exam', async (req, res) => {
        const exam = req.body.name
        const awnsers = req.body.awnsers
        if(awnsers.length === 0) {
            throw new BadRequestException('An exam must have at least 1 awnser.')
        }
        const examId = await queries.insert('exam', { name: exam })
        await Promise.all(awnsers.map(({ awnser, weight }) => queries.insert('exam_awnser', { examId, awnser, weight: weight > 0 ? weight : 1 })))
        const responseJson = {
            exam: await queries.get('exam', examId),
            awnsers: await queries.fetchFilter('exam_awnser', { examId })
        }
        res.json(responseJson)
    })
}