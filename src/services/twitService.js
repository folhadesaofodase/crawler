import axios from 'axios'

const Requester = axios.create({
	baseURL: 'http://localhost:3000'
})

const sendTwit = twit => (
	Requester.post('/twit', twit)
)

export default { sendTwit }