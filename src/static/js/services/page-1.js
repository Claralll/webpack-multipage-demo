
import 'static/css/page/page-1'
import render from 'views/page-1'
import header from 'static/js/component/header'

$util.setTitle('page one')

const data = {
	list: ['item 1', 'item 2', 'item 3']
}

const headerHtml = header()

const html = render(data)
$('#app').html(headerHtml)
$('#app').append(html)

	