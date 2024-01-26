function valueinvert(testing,active) {
	mytesting = testing
	myactive = active
	LeafletMap.on('mousemove',function (e) {
		console.log(e)
		x = e.containerPoint.x + 10
		y = e.containerPoint.y - 65

		//Disable text box for time slider region
		document.getElementById("readout").style.display = "block"
		document.getElementById("readout").style.top = y + "px"
		document.getElementById("readout").style.left = x + "px"
		var layerPoint = LeafletMap.project(e.latlng).floor();
		var tilePoint = layerPoint.divideBy(256).floor();
		tilePoint.z = LeafletMap.getZoom();
		var pointInTile = layerPoint.subtract(tilePoint.multiplyBy(256));
		[red,green,blue] = myactive._tiles[tilePoint.x + ":" + tilePoint.y + ":" + tilePoint.z].el.getContext('2d').getImageData(pointInTile.x,pointInTile.y,1,1).data
		console.log('rgb(' + red + ',' + green + ',' + blue + ')')
		readoutval = colorstuff[mytesting]["rgb2val"]['rgb(' + red + ',' + green + ',' + blue + ')']
		myunit = colorstuff[mytesting]["units"]
		document.getElementById("readouttext").innerHTML = readoutval.toFixed(0) + myunit
	})
}
