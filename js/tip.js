
/** 
 * funcion que usa un proxy en caso de que se este usando https
 *  Si se usa el proxy se toma el puerto 9735 que es el puerto 
 *  por defecto del nodo lightning network
 */
function conexion_uri(addr, ws_port, ln_port=9735)
{
	if (location.protocol === "http:")
		return `ws://${addr}:${ws_port}`

	return `wss://proxy.lnlink.org/${addr}:${ln_port}`
}

/** 
 * funcion básica que usarán todos las funciones  que hacen
 * llamadas rpc nativas al nodo */
async function make_request( method, params, rune) 
{
    const ip="<ip>"
	const id_node="<node_id>"
	const port="8325"
    const ln_connection =  
    {
        id: id_node,
	    uri: conexion_uri(ip, port)
    }
    
	const LNSocket = await lnsocket_init()
	const ln = LNSocket()

	ln.genkey()
	await ln.connect_and_init(ln_connection.id, ln_connection.uri)

	const result = await ln.rpc({ rune, method, params })
	
	ln.disconnect()
	return result
}

/** 
 * Funciones que harán llamadas JSON-RPC nativas al nodo lightning
 * Debes crear una rune para cada funcion rpc
 */

async function rpc_getinfo(params)
{
    const rune="<getinfo_rune>"
	return make_request("getinfo", {},rune) 
}

async function rpc_invoice(params) 
{
	const rune = "<invoice_rune>";

	return make_request("invoice", params, rune)
}

async function rpc_wait_for_invoice(label) 
{
	const rune = "<waitforinvoice_rune_aqui>"

	while (true) 
	{
		try {
			await make_request("waitinvoice", {label}, rune)
			return
		} 
		catch(e)
		{
			console.log("disconnected... trying waitinvoice again")
		}
	}
}

async function getinfo() 
{
	
 const res= await rpc_getinfo(ln_connection, {})

 document.body.innerHTML = `<pre>${JSON.stringify(res.result, undefined, 2)}</pre>`
}

async function mostrar_invoice() 
{
    
    const div_principal = document.querySelector("#principal")
    const div_qrcode = document.querySelector("#div_qrcode")
    
    
    const qrcode = document.querySelector("#qrcode")
    
	const monto = document.querySelector("#monto").value.trim()
	
	const invoice_texto = document.querySelector("#invoice_texto")
	
	//const qrlink = document.querySelector("#qrcode-link")
	let mensaje = document.querySelector("#mensaje").value.trim()


    const montoInt = parseInt(monto);
    
    if (Number.isInteger(montoInt)) 
    {
		if(mensaje==="")
		  mensaje="NA" 
	  
	   const tag_label = "tip-" + new Date().getTime()
	  
	   const invoice = await rpc_invoice({amount_msat: monto+"sat",	label: tag_label,
		  description: mensaje,expiry: 3600})
	  
	   console.log(invoice.result)
  
  
	   if(invoice.result.warning_capacity=="Insufficient incoming channel capacity to pay invoice")
		   alert("Avísale al propietario del nodo que el canal entrante no tiene suficiente capacidad!")
	   
		  const link = "LIGHTNING:" + invoice.result.bolt11.toUpperCase()
		  const qr = new QRCode("qrcode", {
			  text: link,
			  width: 256,
			  height: 256,
			  colorDark : "#000000",
			  colorLight : "#ffffff",
			  correctLevel : QRCode.CorrectLevel.L
		  })
		  //qrlink.href = link
		  
		  invoice_texto.value = invoice.result.bolt11
  
		  div_qrcode.style.display = "block";
		  div_principal.style.display = "none";
		  
		  await rpc_wait_for_invoice(tag_label)
  
		  div_qrcode.innerHTML = '<img src="img/paid.png" >'
		
    }
    else
    {
      alert("Debes ingresar un número entero")
    }  
       	
}