function tileloader(field) {
	try {
		group.eachLayer(function(layer) {
			group.removeLayer(layer)
		})
	}
	catch {
	}
	cv = document.getElementById("cv")
	context = cv.getContext('2d')
	context.clearRect(0,0,cv.width,cv.height)
	document.getElementById("canvascontainer").style.display = "block"
	colorbar(colorstuff[field].min,colorstuff[field].max,colorstuff[field].levels,colorstuff[field].cmap,colorstuff[field].units)
	rgb2val(colorstuff[field].min,colorstuff[field].max,50,colorstuff[field].cmap,colorstuff[field].units,field)
	var hours = ["00","06","12","18","24","30","36","42","48","54","60","66","72","78","84","90","96","102","108","114","120","126","132","138","144","150","156","162","168","174","180"]

	document.getElementById("playbutton").style.display = "inline-block"
	document.getElementById("title").style.display = "block";
	document.getElementById("slidercontainer").style.display = "inline-block";
	document.getElementById("timinginfo").style.display = "inline-block";

	document.getElementById("title").innerHTML = field
	if (typeof time !== 'undefined') {
			group = L.featureGroup().addTo(LeafletMap);
			document.getElementById("Initialization").onchange = function(){initchange(group,field);};
			document.getElementById("playbutton").setAttribute("onclick","slideshow('" + field + "')")
			active = new L.TileLayer.BoundaryCanvas('./outimages/fcn/' + init + '/' + field + '_' + hours[time] + '_tiles/{z}/{x}/{y}.png', {
					maxZoom: 5,
					minZoom: 2,
					opacity: 1,
					tms: true,
					zIndex: 1
				}).addTo(group);
	}
	else {
			document.getElementById("timing").innerHTML = "F00"
			document.getElementById('timeslider').style.display = "inline-block";	
			document.getElementById("playbutton").setAttribute("onclick","slideshow('" + field + "')")
			init = document.getElementById("Initialization").value
			initdate = new Date(Date.UTC(init.slice(0,4),init.slice(4,6)-1,init.slice(6,8),init.slice(9,11)))
			console.log(initdate)
			initfmtd = init.slice(4,6) + '-' + init.slice(6,8) + '-' + init.slice(0,4) + ' ' + init.slice(9,11) + 'Z'
			document.getElementById("initstr").innerHTML = initfmtd
			document.getElementById("plus").innerHTML = "+"
			document.getElementById("equals").innerHTML = "="
			document.getElementById("validstr").innerHTML = initfmtd
			group = L.featureGroup().addTo(LeafletMap);
			document.getElementById("Initialization").onchange = function(){initchange(group,field);};

			time = 0
			
            active = new L.TileLayer.BoundaryCanvas('./outimages/fcn/' + init + '/' + field + '_' + '00' + '_tiles/{z}/{x}/{y}.png', {
                    maxZoom: 5,
                    minZoom: 2,
                    opacity: 1,
                    tms: true,
                    zIndex: 1,
                }).addTo(group);
	}
    $(function() {
        $("#timeslider").slider({
        value:time,
        min:0,
        max:29,
        step:1,
        animate:"fast",
        orientation:"horizontal",
        slide: function(event,ui) {
            time = ui.value;
            active = new L.TileLayer.BoundaryCanvas('./outimages/fcn/' + init + '/' + field + '_' + hours[time] + '_tiles/{z}/{x}/{y}.png', {
                maxZoom: 5,
                minZoom: 2,
                opacity: 1,
				zIndex: 10,
                tms: true
            }).addTo(group);

			setTimeout(() => { 
				var layerno = 0
				group.eachLayer(function(layer) {
					if (layerno==0) {
						group.removeLayer(layer)
					}
					layerno+=1
				})
			},500);
			document.getElementById("timing").innerHTML = "F" + hours[time]
			validdate = moment(initdate).add(6*time,'hours').toDate()
		        validyear = validdate.getUTCFullYear()
			validmonth = String(validdate.getUTCMonth() + 1).padStart(2,'0')
			validday = String(validdate.getUTCDate()).padStart(2,'0')
			validhour = String(validdate.getUTCHours()).padStart(2,'0')
			validdatefilefmt = validyear + validmonth + validday + '_' + validhour
			validdatestr = validmonth + '-' + validday + '-' + validyear + ' ' + validhour + 'Z'
			document.getElementById("validstr").innerHTML = validdatestr
			valueinvert(field,active)
        }
		})
    })
    $("#timeslider .ui-slider-handle").focus();
    $("#timeslider").mousedown(function () {
        LeafletMap.dragging.disable();
    });

    $(document).mouseup(function () {
        LeafletMap.dragging.enable();
    })
    console.log(colorstuff)
    valueinvert(field,active)

}
async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
async function slideshow(field) {
	breakplay = 0;
	var hours = ["00","06","12","18","24","30","36","42","48","54","60","66","72","78","84","90","96","102","108","114","120","126","132","138","144","150","156","162","168","174","180"]
	for (let k=0;k<=29;k++) {
		if (breakplay==0) {
		mytime = k
		active = new L.TileLayer.BoundaryCanvas('./outimages/fcn/' + init + '/' + field + '_' + hours[mytime] + '_tiles/{z}/{x}/{y}.png', {
			maxZoom: 5,
			minZoom: 2,
			opacity: 0,
			zIndex: 10,
			tms: true
		}).addTo(group);

		}
		
	}

	loadlayers(group,hours,field)
}

async function loadlayers(group,hours,field) {
	LeafletMap.off()

	document.getElementById("readout").style.display = "none"
	document.getElementsByClassName("loader")[0].style.display = "block"
	await sleep(4000)
	document.getElementsByClassName("loader")[0].style.display = "none"
	layerkeys = Object.keys(group._layers)
	console.log(layerkeys)
		for (let m=0;m<=29;m++) {
		try {
			group.removeLayer(group._layers[layerkeys[m-5]])
		}
		catch {
		}
		document.getElementsByClassName("ui-slider-handle ui-state-default ui-corner-all")[0].style.left = String(m/29 * 100) + "%"
		group._layers[layerkeys[m]].setOpacity(1)
		document.getElementById("timing").innerHTML = "F" + hours[m]
		validdate = moment(initdate).add(6*m,'hours').toDate()
		validyear = validdate.getUTCFullYear()
		validmonth = String(validdate.getUTCMonth() + 1).padStart(2,'0')
		validday = String(validdate.getUTCDate()).padStart(2,'0')
		validhour = String(validdate.getUTCHours()).padStart(2,'0')
		validdatefilefmt = validyear + validmonth + validday + '_' + validhour
		validdatestr = validmonth + '-' + validday + '-' + validyear + ' ' + validhour + 'Z'
		document.getElementById("validstr").innerHTML = validdatestr
		await sleep(300)
	}
	group.eachLayer(function(layer) {
		group.removeLayer(layer)
	})

     active = new L.TileLayer.BoundaryCanvas('./outimages/fcn/' + init + '/' + field + '_00_tiles/{z}/{x}/{y}.png', {
            maxZoom: 5,
            minZoom: 2,
            opacity: 1,
            tms: true,
            zIndex: 1
        }).addTo(group);
	console.log(active)
	document.getElementById("readout").style.display = "block"
	valueinvert(field,active)
	document.getElementById("timing").innerHTML = "F" + hours[0]
	document.getElementById("validstr").innerHTML = initfmtd
	document.getElementsByClassName("ui-slider-handle ui-state-default ui-corner-all")[0].style.left = "0%"
}

function initchange(group,field) {

	group.clearLayers()
	init = document.getElementById("Initialization").value
        initdate = new Date(Date.UTC(init.slice(0,4),init.slice(4,6)-1,init.slice(6,8),init.slice(9,11)))
        console.log(initdate)
        initfmtd = init.slice(4,6) + '-' + init.slice(6,8) + '-' + init.slice(0,4) + ' ' + init.slice(9,11) + 'Z'
        document.getElementById("initstr").innerHTML = initfmtd
        document.getElementById("plus").innerHTML = "+"
        document.getElementById("equals").innerHTML = "="
        document.getElementById("validstr").innerHTML = initfmtd
	document.getElementById("timing").innerHTML = "F00"
	active = new L.TileLayer.BoundaryCanvas('./outimages/fcn/' + init + '/' + field + '_00_tiles/{z}/{x}/{y}.png', {
		    maxZoom: 5,
		    minZoom: 2,
		    opacity: 1,
		    tms: true,
		    zIndex: 1
		}).addTo(group);
	document.getElementsByClassName("ui-slider-handle ui-state-default ui-corner-all")[0].style.left = "0%"
	valueinvert(field,active)
}
