var map;
var poly = {};
var teamskeys = {};
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: {lat: 41.876, lng: -74.624}
	});
	//$(".weeksel").click(showweek);
	for(i=0;i<teams.length;i++){
		$("#teamicons").append("<span><span class='teamiconname'>"+teams[i].teamkey+"</span><span><img class='smallicon' src='http://prod.static.cardinals.clubs.nfl.com/nfl-assets/img/gbl-ico-team/"+teams[i].teamkey+"/logos/home/large.png' /></span></span>");
		teamskeys[teams[i].teamkey] = teams[i].poly;
		//placepin(parseFloat(teams[i].lat),parseFloat(teams[i].lng),teams[i].teamkey,teams[i].teamkey);
		//var r = placepoly(JSON.parse(teams[i].poly),teams[i].teamkey);
		poly[teams[i].teamkey] = [teams[i].poly];
	}
	showweek();
}
function showweek(e){
	for(i=0;i<wl.length;i++){
		if(wl[i].t1 == wl[i].win){
			for(j=0;j<poly[wl[i].t2].length;j++){
				poly[wl[i].t1].push(poly[wl[i].t2][j]);
			}
			poly[wl[i].t2] = [];
		}
		else if(wl[i].t2 == wl[i].win){
			for(j=0;j<poly[wl[i].t1].length;j++){
				poly[wl[i].t2].push(poly[wl[i].t1][j]);
			}
			poly[wl[i].t1] = [];
		}
	}
	for(i in poly){
		for(j=0;j<poly[i].length;j++){
			placepoly(JSON.parse(poly[i][j]),i);
		}
	}
}


function placepin(lat,lng,title,img){
	var pin = new google.maps.Marker();
	pin.setPosition({lat:lat,lng:lng});
	pin.setTitle(title);
	pin.setMap(map);
}

function placepoly(mp,img){
	var pol = new google.maps.Polygon({paths:mp,fillColor:"blue",fillOpacity:.03});
	
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
	return {poly:pol,label:ol,team:img};
}