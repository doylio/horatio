const iconContainer = document.querySelector('#icon-container')

window.onresize = function() {
	if(iconContainer.offsetWidth < 600) {
		iconContainer.style.flexDirection = 'column'
	} else {
		iconContainer.style.flexDirection = 'row'
	}
}