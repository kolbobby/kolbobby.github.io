var dom = document.implementation.createHTMLDocument();

if('content' in dom.createElement('template')) {
	var dataLoad = function(path) {
		axios.get(path)
			.then(function(response) {
				var diffPage = dom.createElement('template');
				diffPage.innerHTML = response.data;

				document.getElementById('app').innerHTML = diffPage.content.getElementById('app').innerHTML;

				startMock();
			});
	};

	var startMock = function() {
		var links = document.querySelectorAll('a');

		for(var i = links.length; i--;) {
			if(links[i].hostname === location.hostname) {
				page(links[i].pathname, function(ctx) {
					dataLoad(ctx.pathname);
				});

				links[i].addEventListener('click', function(e) {
					e.preventDefault();

					page(e.target.pathname);
				}, false);
			}
		}
	};

	startMock();
	page();

	window.onpopstate = function(e) {
		page.replace(e.state.path);

		dataLoad(e.state.path);
	};
}