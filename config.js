var map;
var poly = [];
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: {lat: 41.876, lng: -74.624}
	});
	$(".scoreupdate").change(updatescore);
	map.addListener('click',setpin);
	placepins();
}
function updatescore(e){
	var event = event || e;
	var gameid = $(event.target).closest("tr").attr("id").substring(7);
	$.ajax({
		url:"update.php?mode=updatescores&gameid="+gameid+"&winner="+$(event.target).val(),
		success:function(r){
			console.log(r);
		},
		error:function(err){
			alert('error');
			console.log(err);
		}
	})
}

function placepins(){
	for(i=0;i<teams.length;i++){
		if(!teams[i].lat){
			var geo = new google.maps.Geocoder();
			geo.geocode({address:teams[i].address},pp.bind(null,teams[i]));
		}
		else{
			placepin(parseFloat(teams[i].lat),parseFloat(teams[i].lng),teams[i].team,teams[i].teamkey);

		}
		if(teams[i].poly){
			placepoly(JSON.parse(teams[i].poly),teams[i].teamkey);
		}
	}
}
function placepin(lat,lng,title,img){
	var pin = new google.maps.Marker();
	pin.setPosition({lat:lat,lng:lng});
	pin.setTitle(title);
	var icon = {
		url: "http://prod.static.cardinals.clubs.nfl.com/nfl-assets/img/gbl-ico-team/"+img+"/logos/home/medium.png", // url
		scaledSize: new google.maps.Size(50, 50), // scaled size
		origin: new google.maps.Point(0,0), // origin
		anchor: new google.maps.Point(0, 0) // anchor
	};
	if(img == "poly"){
		pin.setIcon({
		url: "https://cdn0.iconfinder.com/data/icons/sports-bold-line-5/48/222-512.png", // url
		scaledSize: new google.maps.Size(50, 50), // scaled size
		origin: new google.maps.Point(0,0), // origin
		anchor: new google.maps.Point(50, 50) // anchor
	})
	}
	//pin.setIcon(icon);
	pin.addListener('click',makepoly);
	pin.setMap(map);
	return pin;
}
function placepoly(mp,img){
	var pol = new google.maps.Polygon({paths:mp,fillColor:"blue",fillOpacity:.03});
	pol.setEditable(true);
	pol.getPaths().forEach(function(path, index){
		google.maps.event.addListener(path, 'insert_at', function(){
			revisepoly(pol);
		});
		google.maps.event.addListener(path, 'remove_at', function(){
			revisepoly(pol);
		});
		google.maps.event.addListener(path, 'set_at', function(){
			revisepoly(pol);
		});
	});
	pol.setMap(map);
	var label = new google.maps.Rectangle();
	
	mp.sort(function(a,b){
		if(a.lat < b.lat) return -1;
		if(a.lat > b.lat) return 1;
		return 0;
	});
	var bnd = {};
	var incrementshrink = .025;
	bnd.south = mp[0].lat+incrementshrink;
	bnd.north = mp[mp.length-1].lat-incrementshrink;
	mp.sort(function(a,b){
		if(a.lng < b.lng) return -1;
		if(a.lng > b.lng) return 1;
		return 0;
	});
	bnd.west = mp[0].lng+incrementshrink;
	bnd.east = mp[mp.length-1].lng-incrementshrink;

	label.setBounds(bnd);
	
	while(google.maps.geometry.poly.containsLocation(label.getBounds().getNorthEast(),pol) == false){
		bnd.north=bnd.north - incrementshrink;
		bnd.east=bnd.east - incrementshrink;
		label.setBounds(bnd);
	}
	
	while(google.maps.geometry.poly.containsLocation(label.getBounds().getSouthWest(),pol) == false){
		bnd.south=bnd.south + incrementshrink;
		bnd.west=bnd.west + incrementshrink;
		label.setBounds(bnd);
	}
	
	var ol = new google.maps.GroundOverlay("http://prod.static.cardinals.clubs.nfl.com/nfl-assets/img/gbl-ico-team/"+img+"/logos/home/large.png",bnd);
	ol.setMap(map);
	// var NW = new google.maps.LatLng(label.getBounds().getNorthEast().lat(),label.getBounds().getSouthWest().lng());
	// var SE = new google.maps.LatLng(label.getBounds().getSouthWest().lat(),label.getBounds().getNorthEast().lng());
	// while(google.maps.geometry.poly.containsLocation(NW,pol) == false){
		// bnd.north=bnd.north - incrementshrink;
		// bnd.west=bnd.west - incrementshrink;
		// label.setBounds(bnd);
		// var NW = new google.maps.LatLng(label.getBounds().getNorthEast().lat(),label.getBounds().getSouthWest().lng());
	// }
	// while(google.maps.geometry.poly.containsLocation(SE,pol) == false){
		// bnd.south=bnd.south + incrementshrink;
		// bnd.east=bnd.east + incrementshrink;
		// label.setBounds(bnd);
		// var SE = new google.maps.LatLng(label.getBounds().getSouthWest().lat(),label.getBounds().getNorthEast().lng());
	// }
	//label.setMap(map);
	
	//console.log(bnd);
	//google.maps.geometry.poly.containsLocation({lat:bnd.north,lng:bnd.west},pol);
	
	
	
}
function revisepoly(pol){
	var pts = [];
	pol.getPaths().forEach(function(r){
		var m = r.getArray();
		for(j=0;j<m.length;j++){
			pts.push({lat:m[j].lat(),lng:m[j].lng()});
		}
	});
	var team = ""
	for(i=0;i<teams.length;i++){
		if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(teams[i].lat,teams[i].lng),pol)){
			team = teams[i].teamkey;
			break;
		}
	}
	
	updatepoly(pts,team);
}

function makepoly(){

	var mp = [];
	for(i=0;i<poly.length;i++){
		mp.push({lat:poly[i].position.lat(),lng:poly[i].position.lng()});
		poly[i].setMap(null);
	}
	
	placepoly(mp,$("#teamname").val());
	updatepoly(mp,$("#teamname").val());
}
function updatepoly(mp,team){
	$.ajax({
		url:"update.php?mode=addpoly&poly="+JSON.stringify(mp)+"&team="+team,
		success:function(x){
			console.log(x);
		},
		error:function(err){
			console.log(err);
			alert('error');
		}
	});
	poly = [];
}
function pp(team,e,l){
	//console.log(team);
	if(l == "OK"){
		var lat = e[0].geometry.location.lat();
		var lng = e[0].geometry.location.lng();
		$.ajax({
			url:"update.php?mode=addlatlng&lat="+lat+"&lng="+lng+"&team="+team.team,
			success:function(x){
				console.log(x);
			},
			error:function(err){
				console.log(err);
				alert('error');
			}
		})
	}
	else{
		$("#latlng").show();
		console.log([team,e,l]);
	}
	
}

function setpin(e){
	var ppin = placepin(e.latLng.lat(),e.latLng.lng(),"HERE","poly");
	poly.push(ppin);
}
