import puppeteer from 'puppeteer'

const getValues = async () => {
	const TRANSP_PORTAL_URL = 'http://www.transparencia.pr.gov.br/pte/home'
	const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

	console.log('Launching')
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.goto(TRANSP_PORTAL_URL)
	await page.waitForSelector('.ui-link.ui-widget.link-menu')

	await page.evaluate(() => {
		document.getElementsByClassName('ui-link ui-widget link-menu')[21].click()
	})

	await page.waitForSelector('.ui-selectonemenu-items.ui-selectonemenu-list.ui-widget-content.ui-widget.ui-corner-all.ui-helper-reset')
	await page.waitForSelector('.ui-selectonemenu-item.ui-selectonemenu-list-item.ui-corner-all')
	await page.waitForSelector('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.ui-button.ui-button-success.ui-button-download')

	console.log('Filtering Month')
	await page.evaluate(() => {
		const month = new Date().getMonth()
		document.getElementById('formPesquisaDespesa:filtroMesInicio_items').children[month].click()
		document.getElementById('formPesquisaDespesa:filtroMesTermino_items').children[month].click()

		document.querySelectorAll('input[type=checkbox]')[3].click()
		document.querySelector('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.ui-button.ui-button-success.ui-button-download').click()
	})

	await page.waitForSelector('.ui-datatable-data.ui-widget-content tr td')

	console.log('Extracting Values')
	const values = await page.evaluate(() => (
		Array.from(
			document.getElementsByClassName('ui-datatable-data ui-widget-content')[0].children)
				.map(tr => ({ 
					field: tr.children[0].innerText.split('- ')[1],
					value: tr.children[10].innerText
				})
		)
	))

	const payload = values.map(value => (Object.assign(value, {
		month: MONTHS[new Date().getMonth()],
		year: new Date().getFullYear().toString()
	})))

	await browser.close()
	return payload
}

export default { getValues }