<?php
	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$dbname = "inventorysystem";
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Connect to Server

	try {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e){
		echo $e->getMessage();
	}
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//################################
	function executeQuery($sql){
		global $conn;
		$conn->query($sql);
	}
	
	function oneItem($sql){
		global $conn;
		$result = $conn->query($sql);
		foreach($result as $row){
				$x = $row[0];
		}
		return $x;
	}
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Delivered Item
	function deliveredItem($branch,$level){
		global $conn;
		$sql = "SELECT id, item, count, received, unit, branch, status, rider FROM deliveritem ORDER BY (CASE WHEN branch = '$branch' THEN 0 ELSE 1 END), branch ASC";
		$result = $conn->query($sql);
		
		echo '
			<table id="gridtable">
			<th width="300px">ITEM</th>
			<th width="80px">COUNT</th>
			<th width="100px">RECEIVED</th>
			<th width="70px">UNIT</th>
			<th width="110px">BRANCH</th>
			<th width="110px">STATUS</th>
		';	
		foreach($result as $row){
			if($row[6] == "ACCEPTED" AND $row[5] == $branch){
				print '
					<tr style="color:red">
						<td>'.$row[1].'</td>
						<td>'.$row[2].'</td>
						<td>'.$row[3].'</td>
						<td>'.$row[4].'</td>
						<td>'.$row[5].'</td>
						<td>'.$row[6].'</td>
					</tr>
				';
			}else if($row[5] == $branch){
				print '
					<tr onmouseover=itemselect(this) onmouseout=itemdeselect(this) onclick="modalDeliveredItem(\''.$row[0].','.$row[1].','.$row[2].','.$row[3].','.$row[4].','.$row[5].','.$row[6].','.$row[7].'\')">
						<td>'.$row[1].'</td>
						<td>'.$row[2].'</td>
						<td>'.$row[3].'</td>
						<td>'.$row[4].'</td>
						<td>'.$row[5].'</td>
						<td>'.$row[6].'</td>
					</tr>
				';
			}else{
				if($level == "MAIN"){
					print '
						<tr style="color:white">
							<td>'.$row[1].'</td>
							<td>'.$row[2].'</td>
							<td>'.$row[3].'</td>
							<td>'.$row[4].'</td>
							<td>'.$row[5].'</td>
							<td>'.$row[6].'</td>
						</tr>
					';
				}
			}
		}
		echo "</table>";
	}
	
	function deliverAdd($item,$count,$unit,$rider,$branch){
		$check = "SELECT count(item) FROM deliveritem WHERE branch = '$branch' AND item = '$item'";
		$quantity = "SELECT count FROM deliveritem WHERE branch = '$branch' AND item = '$item'";
		$insert = "INSERT INTO deliveritem(item, count, unit, rider, branch, status) VALUES ('$item','$count','$unit','$rider','$branch','DELIVER')";
		$oneItem = oneItem($check);
		
		if($oneItem == 0){
			executeQuery($insert);
		}else{
			executeQuery("UPDATE deliveritem SET count='" . ($count + oneItem($quantity)) . "',rider='$rider',status='DELIVER' WHERE branch = '$branch' AND item = '$item'");
		}
	}
	
	function acceptItem($id, $item, $count, $unit, $branch){
		executeQuery("UPDATE deliveritem SET status='ACCEPTED',  received = received + $count, count = 0 WHERE item = '$item' AND branch = '$branch'");
	}
	
	function deliveredDel($id){
		$query = "DELETE FROM deliveritem WHERE id='$id'";
		executeQuery($query);
	}
	
	function deliverBreadOnline($item,$count,$unit,$price,$rider,$branch){
		deliverAdd($item,$count,$unit,$rider,$branch);
	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Delivered Item	
	if(isset($_POST['page'])){
		switch ($_POST['page']){
			case "delivereditem":
				deliveredItem($_POST['branch'],$_POST['level']);
			break;
		}
	}
	
	if(isset($_POST['command'])){
		switch ($_POST['page']){
			case "breadroom":
				switch ($_POST['command']){
					case "deliver":
						deliverBreadOnline($_POST['item'],$_POST['count'],$_POST['unit'],$_POST['price'],$_POST['rider'],$_POST['branch']);
					break;
				}
				break;
			case "delivereditem":
				switch ($_POST['command']){
					case "accept":
						acceptItem($_POST['id'],$_POST['item'],$_POST['count'],$_POST['unit'],$_POST['branch'],$_POST['level']);
						ob_end_clean();
						deliveredItem($_POST['branch'],$_POST['level']);
					break;
				}
				break;	
		}
	}
?>