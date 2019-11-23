import PortalService from 'services/portalService'
import TwitService from 'services/twitService'

(async () => {
	const values = await PortalService.getValues()
	const choosen = values[Math.floor(Math.random() * values.length)]

	console.log('Sending Request')
	await TwitService.sendTwit(choosen)
	
	console.log('DONE')
})()