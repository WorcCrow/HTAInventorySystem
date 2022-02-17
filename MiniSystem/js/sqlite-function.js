if(!fileExist(".\\sqlite3\\sqlite3.exe") || !fileExist(".\\db\\InventorySystem.sql")){
	alert("Important program/file is missing, Please reinstall to fix the problem")
	window.close()
}
if(!fileExist("db\\InventorySystem.db")){
	alert("Database is missing, restoring default database ")
	xcCmd("sqlite3\\sqlite3  db\\InventorySystem.db < db\\InventorySystem.sql")
}

function xcCmd(command,wait){//Execute command
	error = 0
	try{
		var obj = new ActiveXObject("WScript.shell");;
		var	stat = obj.run("cmd /c " + command + " & exit",0,wait);
		error = stat
	}catch(err) {
		alert("Cannot execute command : " + command);
	}
	if(error != 0 && error != 1){
		xcCmd(command,wait)
	}
}

function execute(command){
	xcCmd("echo "+ command +";| .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db",true)
}

function readfile(filename) {//Read from file
	try{
		var Object1 = new ActiveXObject('Scripting.FileSystemObject');
		var str0 = Object1.GetFile(filename);
		newfile = str0.OpenAsTextStream(1); 
		var msg= newfile.ReadAll();
		newfile.Close();
		return msg;
	}catch(e){
		if(e.message == "Input past end of file"){
			return "";
		}else{
			alert("Error: " + e.message + "\n" + filename)
		}
	}
}

function fileExist(filename){
	obj = new ActiveXObject("Scripting.FileSystemObject");
	if(obj.FileExists(filename)){
	   return true
	} else {
	   return false
	}
}

function id(i){
	return document.getElementById(i)
}

var Worc = {
	validate:function(username,password){
		xcCmd("echo SELECT position FROM operators WHERE username='"+ username +"' AND password='"+ password +"'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.validate",true)
		return readfile(".\\output\\Worc.validate").replace(/\r|\n/g,"")
	},
	admin:{
		user:{
			add:function(username,password,position){
				if(Worc.count("SELECT count(username) FROM operators WHERE username = '"+ username + "'") == 0){
					execute("INSERT INTO operators(username, password, position) VALUES ('"+ username +"','"+ password +"','"+ position +"')")
				}else{
					execute("UPDATE operators SET password='"+ password +"' WHERE username = '"+ username +"'")
				}
			},
			del:function(username){
				execute("DELETE FROM operators WHERE username='"+ username +"'")
			}
		},
		unit:{
			add:function(item,type){
				if(Worc.count("SELECT count(item) FROM miniitem WHERE item = '"+ item +"' AND type = '"+ type +"'") == 0){
					execute("INSERT INTO miniitem(item, type) VALUES ('"+ item +"','"+ type +"')")
				}else{
					execute("UPDATE miniitem SET item='"+ item +"' WHERE item = '"+ item +"' AND type = '"+ type +"'")
				}
			},
			del:function(item,type){
				execute("DELETE FROM miniitem WHERE item = '"+ item +"' AND type = '"+ type +"'")
			}
		},
		branch:{
			add:function(branch,type){
				if(Worc.count("SELECT count(item) FROM miniitem WHERE item = '"+ branch +"' AND type = '"+ type +"'") == 0){
					execute("INSERT INTO miniitem(item, type) VALUES ('"+ branch +"','"+ type +"')")
				}else{
					execute("UPDATE miniitem SET item='"+ branch +"' WHERE item = '"+ branch +"' AND type = '"+ type +"'")
				}
			},
			del:function(branch,type){
				execute("DELETE FROM miniitem WHERE item = '"+ branch +"' AND type = '"+ type +"'")
			}
		}
	},
	count:function(cmd){
		xcCmd("echo "+ cmd +"; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.count",true)
		return readfile(".\\output\\Worc.count").replace(/\n/g,"").replace(/\r/g,"")
	},
	frame:{
		consumable:function(){
			xcCmd("echo SELECT id, item, count, unit FROM storageroom WHERE itemtype = 'consumable' ORDER BY count DESC; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.frame.consumable",true)
			arr = (readfile(".\\output\\Worc.frame.consumable").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
			compile = "<table id='gridtable'><th width='300px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th>"
			for(x=0;x<arr.length;x++){
				member = arr[x].split("|")
				if(member[0] != "9672"){
					if(member[2] <= 0){
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td></tr>"
					}else{
						compile = compile + "<tr onmouseover=itemselect(this) onmouseout=itemdeselect(this) onclick=\"modalConsumable('"+ member[0] +","+ member[1] +","+ member[2] +","+ member[3] +"')\"><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td></tr>"
					}
				}
			}
			compile = compile + "</table>"
			id("grid").innerHTML = compile
		},
		nonconsumable:function(){
			xcCmd("echo DELETE FROM storageroom WHERE count = 0 AND itemtype = 'nonconsumable'; SELECT id, item, count, unit, state, operator, borrower, time, date FROM storageroom WHERE itemtype = 'nonconsumable'  ORDER BY state ASC; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.frame.nonconsumable",true)
			arr = (readfile(".\\output\\Worc.frame.nonconsumable").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
			compile = "<table id='gridtable'><th width='300px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th><th width='80px'>STATE</th>"
			for(x=0;x<arr.length;x++){
				member = arr[x].split("|")
				if(member[0] != "9672"){
					if(member[4] == "in"){
						if(member[2] <= 0){
							compile = compile + "<tr style='color:gray'><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td></tr>"
						}else{
							compile = compile + "<tr onmouseover=itemselect(this) onmouseout=itemdeselect(this) onclick=\"modalNonConsumable('"+ member[0] +","+ member[1] +"," +member[2] +"," +member[3]+ ","+ member[4] +"," +member[5]+ ","+ member[6] +"," +member[7]+ "," +member[8]+ "')\"><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td></tr>"
						}
					}else{
						compile = compile + "<tr style='color:red'><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td></tr>"
					}
				}
			}
			compile = compile + "</table>"
			id("grid").innerHTML = compile
		},
		breadroom:function(){
			xcCmd("echo SELECT breadroom.id, breadroom.item, breadroom.count, breadroom.unit, pricelist.price FROM breadroom INNER JOIN pricelist ON breadroom.item=pricelist.item; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.frame.breadroom",true)
			arr = (readfile(".\\output\\Worc.frame.breadroom").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
			compile = "<table id='gridtable'><th width='300px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th><th width='80px'>PRICE</th><th width='80px'>TPRICE</th>"
			for(x=0;x<arr.length;x++){
				member = arr[x].split("|")
				if(member[0] != "9672"){
					if(member[2] == 0){
						compile = compile + "<tr style='color:gray'><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[2] * member[4] +"</td></tr>"
					}else{
						compile = compile + "<tr onmouseover=itemselect(this) onmouseout=itemdeselect(this) onclick=\"modalBreadroom('"+ member[0] +","+ member[1] +","+ member[2] +","+ member[3] +","+ member[4] +"')\"><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[2] * member[4] +"</td><td id='blankspace'></td></tr>"
					}
				}
			}
			compile = compile + "</table>"
			id("grid").innerHTML = compile
		},
		availableitem:function(){
			xcCmd("echo SELECT availableitem.id, availableitem.item, availableitem.count, availableitem.unit, pricelist.price FROM availableitem INNER JOIN pricelist ON availableitem.item=pricelist.item ORDER BY count DESC; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.frame.availableitem",true)
			arr = (readfile(".\\output\\Worc.frame.availableitem").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
			compile = "<table id='gridtable'><th width='300px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th><th width='80px'>PRICE</th><th width='80px'>TPRICE</th>"
			for(x=0;x<arr.length;x++){
				member = arr[x].split("|")
				if(member[0] != "9672"){
					if(member[2] == 0){
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[2] * member[4] +"</td></tr>"
					}else{
						compile = compile +"<tr onmouseover=itemselect(this) onmouseout=itemdeselect(this) onclick=\"modalAvailableItem('"+ member[0] +","+ member[1] +","+ member[2] +","+ member[3] +","+ member[4] +"')\"><td>" + member[1] + "</td><td>" + member[2] + "</td><td>" + member[3] + "</td><td>" + member[4] + "</td><td>"+ member[2] * member[4] +"</td></tr>"
					}
				}
			}
			compile = compile + "</table>"
			id("grid").innerHTML = compile
		},
		notificationshow:function(){
			xcCmd("echo SELECT id, item, count, unit, state, operator, borrower, time, date FROM storageroom WHERE itemtype = 'nonconsumable' AND state = 'out'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.frame.notificationshow",true)
			arr = (readfile(".\\output\\Worc.frame.notificationshow").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
			compile = "<table id='notiftable'><th class='notifhead' width='150px'>ITEM</th><th class='notifhead' width='150px'>BORROWER</th>"
			for(x=0;x<arr.length;x++){
				member = arr[x].split("|")
				if(member[0] != "9672"){
					compile = compile + "<tr class='notifrow' onmouseover=itemselect(this) onmouseout=itemdeselect(this) onclick=\"modalNotification('"+ member[0] +","+ member[1] +","+ member[2] +","+ member[3] +","+ member[4] +","+ member[5] +","+ member[6] +","+ member[7] +","+ member[8] +"')\"><td class='notifcontent'>"+ member[1] +"</td><td class='notifcontent'>"+ member[6] +"</td></tr>"
				}
			}
			compile = compile + "</table>"
			id("notifcontent").innerHTML = compile
		},
		pricelist:function(){
			xcCmd("echo SELECT id, item, price FROM pricelist ORDER BY item ASC; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.frame.pricelist",true)
			arr = (readfile(".\\output\\Worc.frame.pricelist").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
			compile = "<table id='gridtable'><th width='300px'>ITEM</th><th width='80px'>PRICE</th>"
			for(x=0;x<arr.length;x++){
				member = arr[x].split("|")
				if(member[0] != "9672"){
					compile = compile + "<tr onmouseover=itemselect(this) onmouseout=itemdeselect(this) onclick=\"modalPricelist('"+ member[0] +","+ member[1] +","+ member[2] +"')\"> <td>"+ member[1] +"</td><td>"+ member[2] +"</td></tr>"
				}
			}
			compile = compile + "</table>"
			id("grid").innerHTML = compile
		}
	},
	list:{
		unit:function(){
			xcCmd("echo SELECT item FROM miniitem WHERE type = 'unit'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.list.unit",true)
			return readfile(".\\output\\Worc.list.unit").replace(/\n/g,"").replace(/\r/g,",") + "WORC"
		},
		branch:function(){
			xcCmd("echo SELECT item FROM miniitem WHERE type = 'branch'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.list.branch",true)
			return readfile(".\\output\\Worc.list.branch").replace(/\n/g,"").replace(/\r/g,",") + "WORC"
		},
		date:function(){
			xcCmd("echo SELECT date FROM record GROUP BY date ORDER BY id; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.list.date",true)
			return readfile(".\\output\\Worc.list.date").replace(/\n/g,"").replace(/\r/g,",") + "WORC"
		},
		user:function(){
			xcCmd("echo SELECT username FROM operators; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.list.user",true)
			return readfile(".\\output\\Worc.list.user").replace(/\n/g,"").replace(/\r/g,",") + "WORC"
		},
		bread:function(){
			xcCmd("echo SELECT item FROM pricelist; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.list.bread",true)
			return readfile(".\\output\\Worc.list.bread").replace(/\n/g,"").replace(/\r/g,",") + "WORC"
		}
	},
	command:{
		consumable:{
			add:function(item,count,unit,operator,time,date){
				if(Worc.count("SELECT count(item) FROM storageroom WHERE item = '"+ item +"' AND itemtype = 'consumable'") == 0){
					execute("INSERT OR IGNORE INTO storageroom(item, itemtype, count, unit, operator, time, date) VALUES ('"+ item +"','consumable','"+ count +"','"+ unit +"','"+ operator +"','"+ time +"','"+ date +"')")
				}else{
					execute("UPDATE storageroom SET count="+ count +" + count, unit='"+ unit +"', operator='"+ operator +"', time='"+ time +"', date='"+ date +"' WHERE item = '" + item + "' AND itemtype = 'consumable'")
				}
				Worc.frame.consumable()
			},
			use:function(item,count,unit,operator,time,date){
				Worc.command.consumable.add(item,-(count),unit,operator,time,date);
			}
			,
			del:function(id,time,date){
				execute("DELETE FROM storageroom WHERE id='"+ id +"'")
				Worc.frame.consumable()
			},
			report:function(date){
				xcCmd("echo SELECT id, item, count, unit, action, operator, time FROM record WHERE itemtype = 'consumable' AND date = '"+date+"'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.report.consumable",true)
				arr = (readfile(".\\output\\Worc.report.consumable").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
				compile = "<b>CONSUMED ITEM REPORT | Date:</b> <font color='blue'>"+ date +"</font><table id='reporttable'><th width='200px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th><th width='80px'>ACTION</th><th width='100px'>OPERATOR</th><th width='120px'>TIME</th>"
				for(x=0;x<arr.length;x++){
					member = arr[x].split("|")
					if(member[0] != "9672"){
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[5] +"</td><td>"+ member[6] +"</td></tr>"
					}
				}
				compile = compile + "</table>"
				id("grid").innerHTML = compile
			},
			updateReport:function(item,count,unit,action,operator,time,date){
				//Worc.command.consumable.updateReport(item,count,unit,action,operator,time,date)
				execute("INSERT INTO record(item, itemtype, count, unit, action, operator, time, date) VALUES ('"+ item +"', 'consumable', '"+ count +"', '"+ unit +"', '"+ action +"', '"+ operator +"', '"+ time +"', '"+ date +"')")
			}
		},
		nonconsumable:{
			add:function(item,count,unit,state,operator,borrower,time,date){
				if(Worc.count("SELECT count(item) FROM storageroom WHERE item = '"+ item +"' AND itemtype = 'nonconsumable' AND state='in'") == 0){
					execute("INSERT INTO storageroom(item, itemtype, count, unit, state, operator, borrower, time, date) VALUES ('"+ item +"','nonconsumable','"+ count +"','"+ unit +"','"+ state +"','"+ operator +"','"+ borrower +"','"+ time +"','"+ date +"')")
				}else{
					execute("UPDATE storageroom SET count=count + "+ count +", operator='"+ operator +"', time='"+ time +"', date='"+ date +"' WHERE item='"+ item +"' AND state = 'in' AND itemtype = 'nonconsumable'")
				}
				Worc.frame.nonconsumable()
			},
			borrow:function(item,count,unit,operator,borrower,time,date){
				execute("INSERT INTO storageroom(item, itemtype, count, unit, state, operator, borrower, time, date) VALUES ('"+ item +"', 'nonconsumable', '"+ count +"', '"+ unit +"', 'out', '"+ operator +"', '"+ borrower +"', '"+ time +"', '"+ date +"')")
				Worc.command.nonconsumable.add(item,-(count),unit,'in',operator,borrower,time,date)
				Worc.frame.notificationshow()
				Worc.frame.nonconsumable()
			},
			returns:function(id,item,count,unit,state,operator,borrower,time,date){
				Worc.command.nonconsumable.del(id)
				Worc.command.nonconsumable.add(item,count,unit,'in',operator,borrower,time,date)
			},
			del:function(id){
				execute("DELETE FROM storageroom WHERE id='"+ id +"'")
				Worc.frame.nonconsumable()
			},
			report:function(date){
				xcCmd("echo SELECT id, item, count, unit, action, borrower, operator, time FROM record WHERE itemtype = 'nonconsumable' AND date = '"+ date +"'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.report.nonconsumable",true)
				arr = (readfile(".\\output\\Worc.report.nonconsumable").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
				compile = "<b>STORAGE ITEM REPORT | Date:</b> <font color='blue'>"+ date +"</font><table id='reporttable'><th width='200px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th><th width='80px'>ACTION</th><th width='100px'>BORROWER</th><th width='100px'>OPERATOR</th><th width='120px'>TIME</th>"
				for(x=0;x<arr.length;x++){
					member = arr[x].split("|")
					if(member[0] != "9672"){
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[5] +"</td><td>"+ member[6] +"</td><td>"+ member[7] +"</td></tr>"
					}
				}
				compile = compile + "</table>"
				id("grid").innerHTML = compile
			},
			updateReport:function(item,count,unit,action,borrower,operator,time,date){
				//Worc.command.nonconsumable.updateReport(item,count,unit,action,borrower,operator,time,date)
				execute("INSERT INTO record(item, itemtype, count, unit, action, borrower, operator, time, date) VALUES ('"+ item +"', 'nonconsumable', '"+ count +"', '"+ unit +"', '"+ action +"', '"+ borrower +"', '"+ operator +"', '"+ time +"', '"+ date +"')")
			}
		},
		breadroom:{
			add:function(item,count,unit){
				if(Worc.count("SELECT count(item) FROM breadroom WHERE item = '"+ item +"'") == 0){
					execute("INSERT INTO breadroom(item, count, unit) VALUES ('"+ item + "','"+ count + "','"+ unit +"')")
				}else{
					execute("UPDATE breadroom SET count="+ count +" + count, unit='"+ unit + "' WHERE item = '"+ item +"'")
				}
				Worc.frame.breadroom()	
			},
			deliver:function(item,count,unit){
				Worc.command.breadroom.add(item,-(count),unit)
			},
			del:function(id){
				execute("DELETE FROM breadroom WHERE id='"+ id +"'")
				Worc.frame.breadroom()
			},
			report:function(date){
				xcCmd("echo SELECT id, item, count, unit, rider, branch, action, operator, time FROM record WHERE itemtype = 'breadroom' AND date = '"+ date +"'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.report.breadroom",true)
				arr = (readfile(".\\output\\Worc.report.breadroom").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
				compile = "<b>BREADROOM STOCK REPORT | Date:</b> <font color='blue'>"+ date +"</font><table id='reporttable'><th width='200px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th><th width='80px'>ACTION</th><th width='100px'>RIDER</th><th width='100px'>BRANCH</th><th width='100px'>OPERATOR</th><th width='120px'>TIME</th>"
				for(x=0;x<arr.length;x++){
					member = arr[x].split("|")
					if(member[0] != "9672"){
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[6] +"</td><td>"+ member[4] +"</td><td>"+ member[5] +"</td><td>"+ member[7] +"</td><td>"+ member[8] +"</td></tr>"
					}
				}
				compile = compile + "</table>"
				id("grid").innerHTML = compile
			},
			updateReport:function(item,count,unit,action,rider,branch,operator,time,date){
				//Worc.command.breadroom.updateReport(item,count,unit,action,rider,branch,operator,time,date)
				execute("INSERT INTO record(item, itemtype, count, unit, action, rider, branch, operator, time, date) VALUES ('"+ item +"', 'breadroom', '"+ count +"', '"+ unit +"', '"+ action +"', '"+ rider +"', '"+ branch +"', '"+ operator +"', '"+ time +"', '"+ date +"')")
			}
		},
		pricelist:{
			add:function(item,price){
				if(Worc.count("SELECT count(item) FROM pricelist WHERE item = '"+ item +"'") == 0){
					execute("INSERT INTO pricelist(item, price) VALUES ('"+ item +"','"+ price +"')")
				}else{
					execute("UPDATE pricelist SET price='"+ price +"' WHERE item = '"+ item +"'")
				}
				Worc.frame.pricelist()	
			},
			del:function(id){
				execute("DELETE FROM pricelist WHERE id='"+ id +"'")
				Worc.frame.pricelist()
			},
			report:function(date){
				xcCmd("echo SELECT id, item, count, action, operator, time FROM record WHERE itemtype = 'pricelist' AND date = '"+ date +"'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.report.pricelist",true)
				arr = (readfile(".\\output\\Worc.report.pricelist").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
				compile = "<b>PRICE MODIFY REPORT | Date:</b> <font color='blue'>"+ date +"</font><table id='reporttable'><th width='200px'>ITEM</th><th width='80px'>PRICE</th><th width='80px'>ACTION</th><th width='100px'>OPERATOR</th><th width='120px'>TIME</th>"
				for(x=0;x<arr.length;x++){
					member = arr[x].split("|")
					if(member[0] != "9672"){
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[5] +"</td></tr>"
					}
				}
				compile = compile + "</table>"
				id("grid").innerHTML = compile
			},
			updateReport:function(item,price,action,operator,time,date){
				//Worc.command.pricelist.updateReport(item,price,action,operator,time,date)
				execute("INSERT INTO record(item, itemtype, count, action, operator, time, date) VALUES ('"+ item +"', 'pricelist', '"+ price +"', '"+ action +"', '"+ operator +"', '"+ time +"', '"+ date +"')")
			}
		},
		availableitem:{
			add:function(item,count,unit){
				if(Worc.count("SELECT count(item) FROM availableitem WHERE item = '"+ item +"'") == 0){
					execute("INSERT INTO availableitem(item, count, unit) VALUES ('"+ item +"','"+ count +"','"+ unit +"')")
				}else{
					execute("UPDATE availableitem SET count="+ count +" + count WHERE item = '"+ item +"'")
				}
			},
			accept:function(item,count,unit){
				Worc.command.availableitem.add(item,count,unit);
			},
			sell:function(item,count,totalprice,unit,operator,time,date){
				Worc.command.availableitem.add(item,-(count),unit);
				execute("INSERT INTO record (item, count, totalprice, unit, itemtype, operator, time, date) VALUES ('"+ item +"','"+ count +"','"+ totalprice +"','"+ unit +"','salesreport','"+ operator +"','"+ time +"','"+ date +"')")
				Worc.frame.availableitem()
			},
			report:function(date){
				xcCmd("echo SELECT id, item, count, unit, totalprice, operator, time, (SELECT SUM(totalprice) FROM record WHERE itemtype = 'salesreport' AND date = '"+ date +"') FROM record WHERE itemtype = 'salesreport' AND date = '"+ date +"'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.report.salesreport",true)
				arr = (readfile(".\\output\\Worc.report.salesreport").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
				compile = "<b>SALES REPORT | Date:</b> <font color='blue'>"+ date +"</font> | <b>Total Sales:</b> <font color='blue' id='reportsales'>0 PHP</font><table id='reporttable'><th width='200px'>ITEM</th><th width='80px'>COUNT</th><th width='70px'>UNIT</th><th width='80px'>TPRICE</th><th width='100px'>OPERATOR</th><th width='120px'>TIME</th>"
				vd56t35 = 0
				for(x=0;x<arr.length;x++){
					member = arr[x].split("|")
					if(member[0] != "9672"){
						vd56t35 = member[7]
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[5] +"</td><td>"+ member[6] +"</td></tr>"
					}
				}
				compile = compile + "</table>"
				id("grid").innerHTML = compile
				id("reportsales").innerHTML = vd56t35 + " PHP" 
			},
			updateReport:function(item,count,unit,action,operator,time,date){
				//Worc.command.availableitem.updateReport(item,count,unit,action,operator,time,date)
				execute("INSERT INTO record(item, itemtype, count, unit, action, operator, time, date) VALUES ('"+ item +"', 'delivereditem', '"+ count +"', '"+ unit +"', '"+ action +"', '"+ operator +"', '"+ time +"', '"+ date +"')")
			}
		},
		accepteditem:{
			report:function(date){
				xcCmd("echo SELECT id, item, count, unit, operator, time FROM record WHERE itemtype = 'delivereditem' AND date = '"+ date +"'; | .\\sqlite3\\sqlite3 .\\db\\InventorySystem.db > .\\output\\Worc.report.accepteditem",true)
				arr = (readfile(".\\output\\Worc.report.accepteditem").replace(/\n/g,"").replace(/\r/g,",") + "9672").split(",")
				compile = "<b>ACCEPTED ITEM REPORT | Date:</b> <font color='blue'>"+ date +"</font><table id='reporttable'><th width='200px'>ITEM</th><th width='80px'>RECEIVED</th><th width='70px'>UNIT</th><th width='100px'>OPERATOR</th><th width='120px'>TIME</th>"
				for(x=0;x<arr.length;x++){
					member = arr[x].split("|")
					if(member[0] != "9672"){
						compile = compile + "<tr><td>"+ member[1] +"</td><td>"+ member[2] +"</td><td>"+ member[3] +"</td><td>"+ member[4] +"</td><td>"+ member[5] +"</td>"
					}
				}
				compile = compile + "</table>"
				id("grid").innerHTML = compile
			}
		}
	}
}