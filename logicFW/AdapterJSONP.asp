<%
    ' 오리진 문제를 해결하기 위한 중개 어뎁터
    Dim callback, url, post

    callback = Request("callback")
    ' url      = Request("url")
	' url 	 = "http://www.albamon.com"
    url 	 = "http://www.naver.com"
    post     = Request("post")


    
    If Len(url) > 0  Then
    	Dim m_ServerXmlHttp
    
	    Set m_ServerXmlHttp = Server.CreateObject("MSXML2.ServerXMLHTTP.6.0")
	
		m_ServerXmlHttp.open "POST", url, False
		m_ServerXmlHttp.setRequestHeader "User-Agent", "request"
'		m_ServerXmlHttp.setRequestHeader "Host", "apis.naver.com"
		m_ServerXmlHttp.setRequestHeader "Pragma", "no-cache"
		m_ServerXmlHttp.setRequestHeader "Accept", "*/*"
		m_ServerXmlHttp.setRequestHeader "Content-type", "application/x-www-form-urlencoded"
'		m_ServerXmlHttp.setRequestHeader "Authorization", ""
	'	m_ServerXmlHttp.setRequestHeader "Content-Length", Len(PostData)
		m_ServerXmlHttp.send post
'	
	    ' xml 의 경우
'	    Response.ContentType = "text/html"
'	    Response.Write (m_ServerXmlHttp.responseXML.xml)

		' html 의 경우
    	Response.ContentType = "text/html"
    	Response.Write (m_ServerXmlHttp.responseText)
    
	End If
%>