//Declaration Area
define()
priceupdate = ""
dropdownset = "0"
var level = "MAIN"

function onload(){
	try{
		id("branchname").innerHTML = branch + " Branch";
	}catch(e){
		alert("userdefine.ini\nconfig branch correctly\nbranch=%branchname%")
		window.close()
	}
	try{
		onlinehost = onlinehost
	}catch(e){
		alert("userdefine.ini\nconfig onlinehost correctly\nonlinehost=https://%hostname%/")
		window.close()
	}
	xcCmd("mkdir output",true)
	xcCmd("attrib +h +s output",true)
	validateAdmin();
	sysTime();
	availableItem();
	getUnit();
	getBranch();
	notificationShow();
	getDate();
	dateOption();
	totalsales();
	updateTotalSales();
	getUser();
	getBread();
	autoSize();
	if(getCookie("userlist") != "userlist"){
		userlist = getCookie("userlist").split(",")
	}
	if(getCookie("logged") != "logged"){
		loggeduser = getCookie("logged")
	}
	if(getCookie("unitlist") != "unitlist"){
		unitlist = getCookie("unitlist").split(",")
	}
	if(getCookie("branchlist") != "branchlist"){
		branchlist = getCookie("branchlist").split(",")
	}
	if(getCookie("breadlist") != "breadlist"){
		breadlist = getCookie("breadlist").split(",")
	}
}

function autoSize(){
	try{
		SCH = screen.height
		SCW = screen.width
		if(SCH >= 600 && SCW >= 1280){
			id("notifcontent").style.height = (SCH - 450) + "px"
			if(getCookie("position") == "ADMIN"){
				id("grid").style.height = (id("sidepanel").offsetHeight - 101) + "px"
			}else{
				id("grid").style.height = (id("sidepanel").offsetHeight - 51) + "px"
			}
		}else{
			alert("Screen resolution should be above Height:1280 * Width:600")
			window.close()
		}
	}catch(e){}
}

function sendPOST(url,param) {//Send post request output on grid
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			id("grid").innerHTML = xhttp.responseText;
			sendPOSTresult = "Success"
		}else if(this.readyState == 4 && this.status != 200){
			alert("Cannot Connect: " + url)
			sendPOSTresult = "Failed"
		}
	}
	setTimeout(function(){
		xhttp.abort();
	},4000)
	try{
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp.send(param);
	}catch(e){
		alert("Error: " + e.message + "\n" + url)
	}
}

function sendPOSTnoReturn(url,param) {//Send post request output on variable return_value
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send(param);
}

////////////////////////////////////////////////////////////////////////////////////////

//Consumable//
function consumable(){
	if(getCookie("page") != "salesreport"){
		document.cookie = "page=consumable"
		buttonSelect(getCookie("page"))
		Worc.frame.consumable()
	}else{
		consumablereport()
	}
}

function useConsumable(){
	usecountv = id("usecount").innerHTML
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	Worc.command.consumable.use(getValue(1),usecountv,getValue(3),getCookie("logged"),timev,datev)
	Worc.command.consumable.updateReport(getValue(1),usecountv,getValue(3),'USE',getCookie("logged"),timev,datev)
	closeModal()
}

function addConsumable(){
	itemv = id("item").value 
	countv = id("count").value 
	unitv = id("unit").innerHTML
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	if(isNaN(parseInt(countv))){
		alert("Enter number only on Count")
	}else if(itemv != "" && parseInt(countv) <= 0 && unitv != ""){
		alert("Please enter count above 0")
	}else if(itemv != "" && countv != "" && unitv != ""){
		Worc.command.consumable.add(itemv,countv,unitv,getCookie("logged"),timev,datev)
		Worc.command.consumable.updateReport(itemv,countv,unitv,'ADD',getCookie("logged"),timev,datev)
		closeModal()
	}else{
		alert("Please fill all field")
	}
}

function modalConsumable(param){
	value = param.split(",")
	arr = []
	for(x=1;x<=value[2];x++){
		arr.push(x)
	}
	id("modal-content").innerHTML = readfile("frame/modalConsumable")
	id("valueholder").innerHTML = value
	id("value-one").innerHTML = ": " + value[1]
	id("value-two").innerHTML = "  USE <span id='usecount'>" + value[2] + "</span> " + value[3]
	id("value-three").innerHTML = dropcount(arr,"drop","usecount")
	id("modal").style.display = "block";
}

function consumablereport(){
	datev = id("selectedDate").innerHTML
	Worc.command.consumable.report(datev)
}
//--Consumable//

//////////////////////////////////////////////////////

//NonConsumable//
function nonconsumable(){
	if(getCookie("page") != "salesreport"){
		document.cookie = "page=nonconsumable"
		buttonSelect(getCookie("page"))
		Worc.frame.nonconsumable()
	}else{
		nonconsumablereport()
	}
}

function addNonconsumable(){
	itemv = id("item").value 
	countv = id("count").value 
	unitv = id("unit").innerHTML
	statev = "in"
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	if(isNaN(parseInt(countv))){
		alert("Enter number only on Count")
	}else if(itemv != "" && parseInt(countv) <= 0 && unitv != ""){
		alert("Please enter count above 0")
	}else if(itemv != "" && countv != "" && unitv != ""){
		Worc.command.nonconsumable.add(itemv,countv,unitv,statev,getCookie("logged"),'',timev,datev)
		Worc.command.nonconsumable.updateReport(itemv,countv,unitv,'ADD','NONE',getCookie("logged"),timev,datev)
		closeModal()
	}else{
		alert("Please fill all field")
	}	
}

function borrowNonConsumable(){
	countv = id("usecount").innerHTML
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	borrowerv = id("borrower").value.replace(/ /g,"")
	if(borrowerv == ""){
		alert("\"BORROWER\" cannot be blank")
	}else{
		Worc.command.nonconsumable.borrow(getValue(1),countv,getValue(3),getCookie("logged"),borrowerv,timev,datev)
		Worc.command.nonconsumable.updateReport(getValue(1),countv,getValue(3),'BORROW',borrowerv,getCookie("logged"),timev,datev)
		setTimeout(function(){notificationShow()},1000)
		closeModal()
	}
}

function borrowShow(){
	id('eight').style.display = "block"
}

function modalNonConsumable(param){
	value = param.split(",")
	arr = []
	for(x=1;x<=value[2];x++){
		arr.push(x)
	}
	id("modal-content").innerHTML = readfile("frame/modalNonConsumable")
	id("valueholder").innerHTML = value
	id("value-one").innerHTML = ": " + value[1]
	id("value-two").innerHTML = " BORROW <span id='usecount'>" + value[2] + "</span> " + value[3]
	id("value-three").innerHTML = dropcount(arr,"drop","usecount")
	id("value-four").innerHTML = ": " + value[4]
	id("value-five").innerHTML = ": " + value[5]
	id("value-six").innerHTML = ": " + value[7]
	id("value-seven").innerHTML = ": " + value[8]
	id("modal").style.display = "block";
}

function nonconsumablereport(){
	datev = id("selectedDate").innerHTML
	Worc.command.nonconsumable.report(datev)
}
//--NonConsumable//

//////////////////////////////////////////////////////

//BreadRoom//
function breadroom(){
	if(getCookie("page") != "salesreport"){
		document.cookie = "page=breadroom"
		buttonSelect(getCookie("page"))
		Worc.frame.breadroom()
	}else{
		breadroomreport()
	}
}

function deliverBread(){
	countv = id("usecount").innerHTML
	branchv = id("branchvalue").innerHTML.replace(": ","")
	riderv = id("rider").value.replace(/ /g,"")
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	sendPOSTresult = ""
	if(riderv == ""){
		alert("\"RIDER\" cannot be blank")
	}else if(branchv == ""){
		alert("Select branch")
	}else{
		sendPOST(onlinehost + "/online/online.php","command=deliver&page=breadroom&item=" + getValue(1) + "&count=" + countv + "&unit=" + getValue(3) + "&price=" + getValue(4) + "&branch=" + branchv + "&rider=" + riderv)
		checkResult = setInterval(function(){
			if(sendPOSTresult == "Success" || sendPOSTresult == "Failed"){
				if(sendPOSTresult == "Success"){
					sendPOSTresult == ""
					Worc.command.breadroom.deliver(getValue(1),countv,getValue(3))
					Worc.command.breadroom.updateReport(getValue(1),countv,getValue(3),'DELIVER',riderv,branchv,getCookie("logged"),timev,datev)
					closeModal()
				}else{
					closeModal()
				}
				clearInterval(checkResult)
			}
		},100)
	}
}

function addBreadroom(){
	itemv = id("selectedBread").innerHTML
	countv = id("count").value
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	if(isNaN(parseInt(countv))){
		alert("Enter number only on Count")
	}else if(itemv != "" && parseInt(countv) <= 0){
		alert("Please enter count above 0")
	}else if(itemv != "" && countv != ""){
		Worc.command.breadroom.add(itemv,countv,"pcs")
		Worc.command.breadroom.updateReport(itemv,countv,'pcs','ADD','NONE','NONE',getCookie("logged"),timev,datev)
		closeModal()
	}else{
		alert("Please fill all field")
	}
}

function addBread(){
	breadroom()
	id("modal-content").innerHTML = readfile("frame/addBreadroom")
	id("selectedBread").innerHTML = removeItem(breadlist,"WORC")[0]
	id("listbread").innerHTML = dropcount(removeItem(breadlist,"WORC"),"breadlist","selectedBread")
	id("modal").style.display = "block";
}

function modalBreadroom(param){
	value = param.split(",")
	arr = []
	for(x=1;x<=value[2];x++){
		arr.push(x)
	}
	id("modal-content").innerHTML = readfile("frame/modalBreadroom")
	id("valueholder").innerHTML = value
	id("value-one").innerHTML = ": " + value[1]
	id("value-two").innerHTML = " DELIVER <span id='usecount'>" + value[2] + "</span> " + value[3]
	id("value-three").innerHTML = dropcount(arr,"drop","usecount")
	id("drop2").innerHTML = dropcount(removeItem(branchlist,"WORC"),"branch","branchvalue")
	id("value-four").innerHTML = ": " + value[4]
	id("value-five").innerHTML = ": " + value[2] * value[4] + "PHP"
	id("modal").style.display = "block";
	id("rider").focus()
	priceupdate = setInterval(function(){id("value-five").innerHTML = ": " + parseInt(id("usecount").innerHTML) * value[4] + "PHP"},250)
}

function breadroomreport(){
	datev = id("selectedDate").innerHTML
	Worc.command.breadroom.report(datev)
}

//--BreadRoom//

//////////////////////////////////////////////////////

//DeliveredItem//

function deliveredItem(){
	if(getCookie("page") != "salesreport"){
		document.cookie = "page=delivereditem"
		buttonSelect(getCookie("page"))
		sendPOST(onlinehost + "/online/online.php","page=delivereditem&level=" + level + "&branch=" + branch)
	}else{
		deliveredreport()
	}
}

function acceptItem(){
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	idv = getValue(0)
	itemv = getValue(1)
	countv = getValue(2)
	unitv = getValue(4)
	sendPOSTresult = ""
	sendPOST(onlinehost + "/online/online.php","command=accept&page=" + getCookie("page") + "&id=" + idv + "&item=" + itemv + "&count=" + countv + "&unit=" + unitv + "&level=" + level + "&branch=" + branch)
	checkResult = setInterval(function(){
		if(sendPOSTresult == "Success" || sendPOSTresult == "Failed"){
			if(sendPOSTresult == "Success"){
				sendPOSTresult == ""
				Worc.command.availableitem.accept(itemv,countv,unitv)
				Worc.command.availableitem.updateReport(itemv,countv,unitv,'ACCEPTED',getCookie("logged"),timev,datev)
				deliveredItem()
			}else{
				location.reload()
			}
			clearInterval(checkResult)
		}
	},100)
	closeModal()
}

function modalDeliveredItem(param){
	value = param.split(",")
	id("modal-content").innerHTML = readfile("frame/modalDeliveredItem")
	id("valueholder").innerHTML = value
	id("value-one").innerHTML = ": " + value[1]
	id("value-two").innerHTML = ": " + value[2] + " " + value[4]
	id("value-three").innerHTML = ": " + value[6]
	id("value-four").innerHTML = ": " + value[5]
	id("value-five").innerHTML = ": " + value[7]
	id("modal").style.display = "block";
}

function deliveredreport(){
	datev = id("selectedDate").innerHTML
	Worc.command.accepteditem.report(datev)
}

//--DeliveredItem//

//////////////////////////////////////////////////////

//Available Item//

function availableItem(){
	document.cookie = "page=availableitem"
	buttonSelect(getCookie("page"))
	Worc.frame.availableitem()
}

function sellItem(){
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	if(isNaN(parseInt(id("count").value))){
		alert("Enter number only on sell value")
	}else if(parseInt(id("count").value) <= 0){
		alert("Please enter value above 0")
	}else if(parseInt(id("count").value) <= parseInt(getValue(2))){
		document.cookie = "totalsales=" + (parseInt(getCookie("totalsales")) + parseInt(getValue(4) * id("count").value))
		Worc.command.availableitem.sell(value[1],id("count").value,getValue(4) * id("count").value,value[3],getCookie("logged"),timev,datev);
		closeModal()
	}else{
		alert("Enter Value")
	}
}

function modalAvailableItem(param){
	value = param.split(",")
	id("modal-content").innerHTML = readfile("frame/modalAvailableItem")
	id("valueholder").innerHTML = value
	id("value-one").innerHTML = ": " + value[1]
	id("value-two").innerHTML = ": " + value[2] + " " + value[3]
	id("modal").style.display = "block";
	id("count").focus()
}
//--Available Item//

//////////////////////////////////////////////////////

//Notification//

function notificationShow(){
	Worc.frame.notificationshow()
}

function notifReturn(){
	id("notifcontent").innerHTML = "";
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	Worc.command.nonconsumable.returns(value[0],value[1],value[2],value[3],'in',getCookie("logged"),value[6],timev,datev)
	Worc.command.nonconsumable.updateReport(value[1],value[2],value[3],'RETURNED',value[6],getCookie("logged"),timev,datev)
	closeModal()
	setTimeout(function(){notificationShow()},500)
}

function modalNotification(param){
	value = param.split(",")
	id("modal-content").innerHTML = readfile("frame/modalNotification")
	id("valueholder").innerHTML = value
	id("value-one").innerHTML = ": " + value[1]
	id("value-two").innerHTML = ": " + value[2] + " " + value[3]
	id("value-three").innerHTML = ": " + value[4]
	id("value-four").innerHTML = ": " + value[5]
	id("value-five").innerHTML = ": " + value[6]
	id("value-six").innerHTML = ": " + value[7]
	id("value-seven").innerHTML = ": " + value[8]
	id("modal").style.display = "block";
}

//--Notification//

//////////////////////////////////////////////////////

//Price List//

function priceList(){//Show table
	if(getCookie("page") != "salesreport"){
		document.cookie = "page=pricelist"
		buttonSelect(getCookie("page"))
		Worc.frame.pricelist()
	}else{
		pricelistreport()
	}
}

function addPriceList(){
	itemv = id("item").value 
	pricev = id("price").value 
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	if(isNaN(parseInt(pricev))){
		alert("Enter number only on Price")
	}else if(itemv != "" && parseInt(pricev) <= 0){
		alert("Please enter Price above 0")
	}else if(itemv != "" && pricev != ""){
		Worc.command.pricelist.add(itemv,pricev)
		Worc.command.pricelist.updateReport(itemv,pricev,'ADD',getCookie("logged"),timev,datev)
		closeModal()
	}else{
		alert("Please fill all field")	
	}
}

function modalPricelist(param){
	if(getCookie("position") == "ADMIN"){
		value = param.split(",")
		id("modal-content").innerHTML = readfile("frame/modalPricelist")
		id("valueholder").innerHTML = value
		id("value-one").innerHTML = ": " + value[1]
		id("value-two").innerHTML = ": " + value[2] + " PHP"
		id("modal").style.display = "block";
	}
}

function pricelistreport(){
	datev = id("selectedDate").innerHTML
	Worc.command.pricelist.report(datev)
}

//--Price List//

//////////////////////////////////////////////////////

//Sales Report//

function report(){
	document.cookie = "page=salesreport"
	buttonSelect(getCookie("page"))
	datev = id("selectedDate").innerHTML
	Worc.command.availableitem.report(datev)
}

//--Sales Report//

//////////////////////////////////////////////////////

function getCookie(n){
	cookieObject = {}
	cookie = document.cookie.split(";")
	for(x=0;x<cookie.length;x++){
		try{
			cookie[x].split("=")[0]
			eval('cookieObject.' + cookie[x].split("=")[0] + '="' + cookie[x].split("=")[1] + '"')
		}catch(e){
			return n
		}
	}
	if(String(eval("cookieObject." + n)) == "undefined"){
		return n
	}else{
		return eval("cookieObject." + n)
	}
}

function getValue(n){
	try{
		result = id("valueholder").innerHTML.split(",")
	}catch(e){
		return "NULL"
	}
	return result[n]
}

function itemselect(ssalc){
		ssalc.style.cursor = "pointer"
		ssalc.style.color = "blue"
		ssalc.style.fontSize = "20px"
		ssalc.style.fontWeight = "bold"
}

function itemdeselect(ssalc){
		ssalc.style.color = ""
		ssalc.style.fontSize = ""
		ssalc.style.fontWeight = ""
}

function addFrame(){
	clearInterval(priceupdate)
	v = getCookie("page")
	switch (v){
		case "consumable":
			id("modal-content").innerHTML = readfile("frame/addConsumable")
			id("value-four").innerHTML = dropcount(removeItem(unitlist,"WORC"),"unitlist","unit")
			id("modal").style.display = "block";
			id("item").focus()
		break
		case "nonconsumable":
			id("modal-content").innerHTML = readfile("frame/addNonConsumable")
			id("value-four").innerHTML = dropcount(removeItem(unitlist,"WORC"),"unitlist","unit")
			id("modal").style.display = "block";
			id("item").focus()
		break
		case "breadroom":
			id("modal-content").innerHTML = readfile("frame/addBreadroom")
			id("selectedBread").innerHTML = removeItem(breadlist,"WORC")[0]
			id("listbread").innerHTML = dropcount(removeItem(breadlist,"WORC"),"breadlist","selectedBread")
			id("modal").style.display = "block";
		break
		case "pricelist":
			id("modal-content").innerHTML = readfile("frame/addPriceList")
			id("modal").style.display = "block";
			id("item").focus()
		break
		default:
		break;
	}
}

function addItem(){
	v = getCookie("page")
	switch (v){
		case "consumable":
		addConsumable()
		break
		case "nonconsumable":
		addNonconsumable()
		break
		case "breadroom":
		addBreadroom()
		break
		case "pricelist":
		addPriceList()
		break
	}
}

function useButton(){
	v = getCookie("page")
	switch (v){
		case "consumable":
		useConsumable()
		break
		case "nonconsumable":
		borrowNonConsumable()
		break
		case "breadroom":
		deliverBread()
		break
	}
}

function delItem(){
	clearInterval(priceupdate)
	timev = id("currentTime").innerHTML
	datev = id("currentTime").title.replace(/,/g,"")
	value = id("valueholder").innerHTML.split(",")
	switch(getCookie("page")){
		case "consumable":
			Worc.command.consumable.del(value[0])
			Worc.command.consumable.updateReport(value[1],value[2],value[3],'DELETE',getCookie("logged"),timev,datev)
		break;
		
		case "nonconsumable":
			Worc.command.nonconsumable.del(value[0])
			Worc.command.nonconsumable.updateReport(value[1],value[2],value[3],'DELETE','NONE',getCookie("logged"),timev,datev)
		break;
		
		case "breadroom":
			Worc.command.breadroom.del(value[0])
			Worc.command.breadroom.updateReport(value[1],value[2],value[3],'DELETE','NONE','NONE',getCookie("logged"),timev,datev)
		break;
		
		case "pricelist":
			Worc.command.pricelist.del(value[0])
			Worc.command.pricelist.updateReport(value[1],value[2],'DELETE',getCookie("logged"),timev,datev)
		break;
	}
	id("modal").style.display = "none";
}

function closeModal(){
	clearInterval(priceupdate)
	id("modal-content").innerHTML = ""
	id("modal").style.display = "none";
	dropdownset = 0
	
}

function dropcount(arr,name,namev){
	result = "<div class='dropdownBody' id='" + name + "'><div id='dropdown'>"
	for(x=arr.length-1;x>=0;x--){
		result = result + "<span class='dropdowncontent' onmouseover='dropdownOver(this)' onmouseout='dropdownOut(this)' onclick='setValue(this.value,\""+ name +"\",\""+ namev +"\")' value='" + arr[x] + "'>" + arr[x] + "</span>"
	}
	result = result + "</div></div>"
	return result
}

function setValue(value,name,namev){
	id(namev).innerHTML = value
	id(name).style.display = "none"
	dropdownset = 0
}

function dropdownOver(e){
	e.style.backgroundColor = "red"
}

function dropdownOut(e){
	e.style.backgroundColor = "orange"
}

function dropdownShow(name,elem){
	try{
		if(dropdownset == 1){
			id(currentdropdown).style.display = "none"
			dropdownset = 0
			
		}else{
			id(name).style.display = "block"
			currentdropdown = name
			dropdownset = 1
		}
	}catch(e){
		alert("Reload to fix the problem")
		location.reload();
	}
}

function dropdownDisable(name){
	id(name).style.display = "none"
	id(name).removeAttribute("id")
}

function dropdownBranch(elem){
	id("submit").innerHTML = "DELIVER"
	id("submit").onclick = function(){useButton()}
}

function dateOption(){
	clear = setInterval(function(){
		if(getCookie("datelist") != "datelist" && getCookie("datelist") != "null"){
			d = date.toLocaleDateString()
			id("selectedDate").innerHTML = d.replace(/,/g,"")
			arr = getCookie("datelist").split(",")
			arr.pop()
			id("dateList").innerHTML = dropcount(arr,"dateL","selectedDate")
			id("selectedDate").removeAttribute("disabled")
			clearInterval(clear)
		}
	},500)
}

function sysTime(){
	date = new Date()
	d = date.toLocaleDateString()
	t = date.toLocaleTimeString()
	id("currentTime").innerHTML = t 
	id("currentTime").title = d 
	setTimeout(sysTime,1000)
}

function id(i){
	return document.getElementById(i)
}

function enableSubmit(){
	id("submit").removeAttribute("disabled")
}

function alphanumericOnly(key){
	if(getValue(2) != "NULL"){
		if(parseInt(key.value) > parseInt(getValue(2))){
			key.value = getValue(2).replace(/[^0-9|^a-z|^A-Z|\ ]/g, '');
		}
	}
	key.value = key.value.replace(/[^0-9|^a-z|^A-Z|\ ]/g, '');
}

function numericOnly(key){
	if(getValue(2) != "NULL"){
		if(parseInt(key.value) > parseInt(getValue(2))){
			key.value = getValue(2).replace(/[^0-9]/g, '');
		}
	}
	key.value = key.value.replace(/[^0-9]/g, '');
}

function validateAdmin(){
	if(getCookie("position") == "ADMIN"){
		id("loggedname").innerHTML = getCookie("logged")
		id("customstyle").removeAttribute("disabled")
		id("mainframe").style.display = "block"
	}else if(getCookie("position") == "OPERATOR"){
		id("loggedname").innerHTML = getCookie("logged")
		id("mainframe").style.display = "block"
	}else{
		loginModal()
	}	
}

function loginModal(){
	id("modal-content").innerHTML = readfile("frame/modalLogin")
	id("modal").style.display = "block";
}

function logOut(){
	document.cookie = "position=logout"
	document.cookie = "logged="
	location.reload();
}

function keyPress(event){
	switch (event.keyCode){
		case 13:
			try{
				id("submit").click()
			}catch(e){}
		break;
		
		case 27:
			try{
				id("close").click()
			}catch(e){}
		break;
		
		case 107:
			try{
				if(getCookie("position") == "ADMIN"){
					id("add").click()
				}else{
					addBread()
				}
			}catch(e){}
		break;
		
		case 46: case 110:
			try{
				if(getCookie("position") == "ADMIN"){
					id("delete").click()
				}
			}catch(e){}
		break;
	}
}

function buttonSelect(page){
	color = "white"
	ccolor = "gray"
	consumablecolor = color
	nonconsumablecolor = color
 	breadroomcolor = color
	pricelistcolor = color
	delivereditemcolor = color
	availableitemcolor = color
	salesreportcolor = color
	switch (page){
		case 'consumable':
			consumablecolor = ccolor
		break;
		
		case 'nonconsumable':
			nonconsumablecolor = ccolor
		break;
		
		case 'breadroom':
			breadroomcolor = ccolor
		break;
		
		case 'pricelist':
			pricelistcolor = ccolor
		break;
		
		case 'delivereditem':
			delivereditemcolor = ccolor
		break;
		
		case 'availableitem':
			availableitemcolor = ccolor
		break;
		
		case 'salesreport':
			salesreportcolor = ccolor
		break;
	}
	
	id("consumable").style.backgroundColor = consumablecolor
	id("nonconsumable").style.backgroundColor = nonconsumablecolor
	id("breadroom").style.backgroundColor = breadroomcolor
	id("pricelist").style.backgroundColor = pricelistcolor
	id("delivereditem").style.backgroundColor = delivereditemcolor
	id("availableitem").style.backgroundColor = availableitemcolor
	id("salesreport").style.backgroundColor = salesreportcolor
}

function login(){
	user = id("username").value
	pass = id("password").value
	position = Worc.validate(user,pass)
	if(position != ""){
		if(position == "ADMIN" || position == "OPERATOR"){
			document.cookie = "position=" + position
			document.cookie = "logged=" + user
			loggeduser = user
			location.reload();
		}
	}else{
		alert("Username or Password is Invalid")
	}
}

function getUnit(){
	unit = Worc.list.unit()
	if(String(unit) != "undefined"){
		document.cookie = "unitlist=" + unit.replace(/(\r\n|\n|\r)/gm,"")
		unitlist = unit.replace(/(\r\n|\n|\r)/gm,"").split(",")
	}else{
		document.cookie = "unitlist=Initializing..."
	}
}

function getBread(){
	bread = Worc.list.bread()
	if(String(bread) != "undefined"){
		document.cookie = "breadlist=" + bread.replace(/(\r\n|\n|\r)/gm,"")
		breadlist = bread.replace(/(\r\n|\n|\r)/gm,"").split(",")
	}else{
		document.cookie = "breadlist=Initializing..."
	}
}

function getBranch(){
	brancharr = Worc.list.branch()
	if(String(brancharr) != "undefined"){
		document.cookie = "branchlist=" + brancharr.replace(/(\r\n|\n|\r)/gm,"")
		branchlist =  brancharr.replace(/(\r\n|\n|\r)/gm,"").split(",")
	}else{
		document.cookie = "branchlist=Initializing..."
	}
}

function getDate(){
	etad = Worc.list.date()
	if(String(etad) != "undefined"){
		document.cookie = "datelist=" + etad.replace(/(\r\n|\n|\r)/gm,"")
	}else{
		document.cookie = "datelist=null"
	}	
}

function getUser(){
	user = Worc.list.user()
	if(String(user) != "undefined"){
		document.cookie = "userlist=" + user.replace(/(\r\n|\n|\r)/gm,"")
		userlist = user.replace(/(\r\n|\n|\r)/gm,"").split(",")
	}else{
		document.cookie = "userlist=Initializing..."
	}	
}

function totalsales(){		
	datev = id("currentTime").title.replace(/,/g,"")
	sales = Worc.count("SELECT SUM(totalprice) FROM record WHERE itemtype = 'salesreport' AND date = '"+ datev +"'")
	if(String(sales) != "undefined"){
		if(String(sales) != ""){
			document.cookie = "totalsales=" + sales
		}else{
			document.cookie = "totalsales=" + 0
		}
	}
}

function updateTotalSales(){
	setInterval(function(){
		if(!isNaN(getCookie("totalsales"))){
			id("totalSales").innerHTML = getCookie("totalsales") + " PHP"
		}
	},500)
}

function cleanArray(arr) {
  var newArr = new Array();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

function define(){
	try{
		arr = cleanArray(readfile("userdefine.ini").replace(/(\r\n|\n|\r)/gm,",").replace(/(\"|\'| )/gm,"").split(","))
		splitarr = []
		for(x=0;x<arr.length;x++){
			splitarr = arr[x].split("=")
			eval(splitarr[0] + '="' + splitarr[1] + '"')
		}
	}catch(e){
		alert("Error : " + e)
		alert("Please configure userdefine.ini")
		window.close()
	}
}

function removeItem(a,i){
	result = []
	for(x=0;x<a.length;x++){
		if(a[x] != i){
			result.push(a[x])
		}
	}
	return result
}

//////////////////////////////////////////////////////
//ADMIN//

function admincontrol(){
	id("modal-content").innerHTML = readfile("frame/modalAdmin")
	id("modal").style.display = "block";
}

function adminMouseIn(elem){
	elem.style.backgroundColor = "#99C68E"
}

function adminMouseOut(elem){
	elem.style.backgroundColor = "#89C35C"
}

//////////////////////////////////////////////////////

function addUserModal(){
	closeModal()
	position = 2
	usertype = "NEWUSER"
	userlist = removeItem(userlist,loggeduser)
	id("modal-content").innerHTML = readfile("frame/modalAddUser")
	id("listuser").innerHTML = dropcount(removeItem(userlist,"WORC"),"username","currentUser")
	id("modal").style.display = "block";
	if(String(userlist).replace(/,/g,"") == ""){
		id("modal-content").innerHTML = "Initializing..."
		setTimeout(function(){addUserModal()},2000)
	}
}

function addUser(){
	if(position == 1){
		position = "ADMIN"
	}else if(position == 2){
		position = "OPERATOR"
	}
	if(usertype == "NEWUSER"){
		msg = "Added "
		usernamev = id("newUser").value
		passwordv = id("password").value
		if(usernamev == "" || passwordv == ""){
			alert("Username or Password is blank")
			stop = 1
		}else{
			stop = 0
		}
	}else{
		msg = "Updated "
		usernamev = id("currentUser").innerHTML
		passwordv = id("password").value
		if(usernamev == "Select User"){
			alert("Select Username First")
			stop = 1
		}else{
			if(passwordv == ""){
				alert("Username or Password is blank")
			}else{
				stop = 0
			}
		}
	}
	if(stop != 1){
		Worc.admin.user.add(usernamev,passwordv,position)
		userlist.push(usernamev)
		id("modal-content").innerHTML = "Successfully " + msg + " <font color=red>'" + usernamev  + "'</font> as " + position
		setTimeout(function(){addUserModal()},2000)
	}
}

function delUser(){
	usernamev = id("currentUser").innerHTML
	if(usernamev == "Select User"){
			alert("Select Username First")
	}else if(usertype == "CURRENTUSER"){
		Worc.admin.user.del(usernamev)
		userlist = removeItem(userlist,usernamev)
		id("modal-content").innerHTML = "Deleted Successfully <font color=red>'" + usernamev + "'</font>"
		setTimeout(function(){addUserModal()},2000)
	}
}

function newUser(){
	id("currentUser").style.display = "none"
	id("newUser").style.display = "block"
	id("delete").style.display = "none"
	id("submit").innerHTML = "ADD"
	usertype = "NEWUSER"
}

function currentUser(){
	id("newUser").style.display = "none"
	id("currentUser").style.display = "block"
	id("delete").style.display = "block"
	id("submit").innerHTML = "UPDATE"
	usertype = "CURRENTUSER"
}

//////////////////////////////////////////////////////
function addUnitModal(){
	id("modal-content").innerHTML = readfile("frame/modalAddUnit")
	id("listunit").innerHTML = dropcount(removeItem(unitlist,"WORC"),"unit","currentUnit")
	id("modal").style.display = "block";
	if(String(unitlist).replace(/,/g,"") == ""){
		id("modal-content").innerHTML = "Initializing..."
		setTimeout(function(){addUserModal()},2000)
	}
}

function addUnit(){
	itemv = id("newUnit").value
	if(itemv == ""){
		alert("Blank Entry")
	}else if(itemv != ""){
		Worc.admin.unit.add(itemv,'unit')
		unitlist.push(itemv)
		id("modal-content").innerHTML = "Successfully Added Unit <font color=red>'" + itemv  + "'</font>"
		setTimeout(function(){addUnitModal()},2000)
	}
}

function delUnit(){
	itemv = id("currentUnit").innerHTML
	if(itemv == "Select Unit"){
			alert("Select Unit First")
	}else if(usertype == "CURRENTUNIT"){
		Worc.admin.unit.del(itemv,'unit')
		unitlist = removeItem(unitlist,itemv)
		id("modal-content").innerHTML = "Item Deleted Successfully <font color=red>'" + itemv + "'</font>"
		setTimeout(function(){addUnitModal()},2000)
	}
}

function newUnit(){
	id("currentUnit").style.display = "none"
	id("newUnit").style.display = "block"
	id("delete").style.display = "none"
	id("submit").style.display = "block"
	usertype = "NEWUNIT"
}

function currentUnit(){
	id("newUnit").style.display = "none"
	id("currentUnit").style.display = "block"
	id("delete").style.display = "block"
	id("submit").style.display = "none"
	usertype = "CURRENTUNIT"
}

//////////////////////////////////////////////////////
function addBranchModal(){
	id("modal-content").innerHTML = readfile("frame/modalAddBranch")
	id("listbranch").innerHTML = dropcount(removeItem(branchlist,"WORC"),"branch","currentBranch")
	id("modal").style.display = "block";
	if(String(branchlist).replace(/,/g,"") == ""){
		id("modal-content").innerHTML = "Initializing..."
		setTimeout(function(){addBranchModal()},2000)
	}
}

function addBranch(){
	branchv = id("newBranch").value
	if(branchv == ""){
		alert("Blank Entry")
	}else if(branchv != ""){
		Worc.admin.branch.add(branchv,'branch')
		branchlist.push(branchv)
		id("modal-content").innerHTML = "Successfully Added Branch <font color=red>'" + branchv  + "'</font>"
		setTimeout(function(){addBranchModal()},2000)
	}
}

function delBranch(){
	branchv = id("currentBranch").innerHTML
	if(branchv == "Select Branch"){
			alert("Select Branch First")
	}else if(usertype == "CURRENTBRANCH"){
		Worc.admin.branch.del(branchv,'branch')
		branchlist = removeItem(branchlist,branchv)
		id("modal-content").innerHTML = "Branch Deleted Successfully <font color=red>'" + branchv + "'</font>"
		setTimeout(function(){addBranchModal()},2000)
	}
}

function newBranch(){
	id("currentBranch").style.display = "none"
	id("newBranch").style.display = "block"
	id("delete").style.display = "none"
	id("submit").style.display = "block"
	usertype = "NEWBRANCH"
}

function currentBranch(){
	id("newBranch").style.display = "none"
	id("currentBranch").style.display = "block"
	id("delete").style.display = "block"
	id("submit").style.display = "none"
	usertype = "CURRENTBRANCH"
}



//--ADMIN//



































