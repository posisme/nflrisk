<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <title>NFL RISK</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script>		
<?php
	date_default_timezone_set('America/Chicago');
	$config = parse_ini_file('/var/www//nflriskconfig.ini');
	
	$conn = new mysqli($config["mysqlhost"],$config["mysqluser"],$config["mysqlpassword"],$config["mysqldbname"]);
	$res = $conn->query("select * from stad");
	$teams = array();
	while($r = $res->fetch_assoc()){
		$teams[] = $r;
	}
	echo "var teams = ".json_encode($teams).";\n";
?>
</script>
	<script src="config.js"></script>
	<link rel='stylesheet' type='text/css' href='config.css'>
  </head>
  <body>
  <p id='latlng' style='display:none;'>Still Need More Lat/Lngs</p>
    <div id="map"></div>

	<div><p>Who is this?</p><p><select id='teamname'>
<?php
		foreach($teams as $i){
			//if(!$i["poly"]){
				echo "<option value='".$i["teamkey"]."'>".$i["team"]."</option>";
			//}
		}
?>
		
	</select></p>
	</div>
	<div id='winloss'>
	<table>
	<tr><th>Week</th><th>Team 1</th><th>Team 2</th><th>Winner</th></tr>
	<?php 
	$res = $conn->query("select * from winslosses");
	while($r = $res->fetch_assoc()){
		echo "<tr id='gameid-".$r["gameid"]."'><td>".$r["week"]."</td><td>".$r["t1"]."</td><td>".$r["t2"]."</td><td><select class='scoreupdate'><option value=''>Select...</option>";
		echo "<option value='".$r["t1"]."'";
		if($r["t1"] == $r["win"]){
			echo " selected ";
		}
		echo ">".$r["t1"]."</option><option value='".$r["t2"]."'";
		if($r["t2"] == $r["win"]){
			echo " selected ";
		}
		echo ">".$r["t2"]."</option></select></td></tr>";
	}
	?>
	</table>
	</div>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD0sVVdxyD7HqGhEfPEqzTO84OkSClWjTg&&libraries=geometry&callback=initMap">
    </script>
  </body>
</html>