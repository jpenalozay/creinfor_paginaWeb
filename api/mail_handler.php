<?php
		$name=$_POST['name'];
		$email=$_POST['email'];
		$phone=$_POST['phone'];
		$msg=$_POST['msg'];
		$from='creinforWP@creinfor.com';
		$fromR='jose.penaloza@creinfor.com';
		$to='jpenalozay@gmail.com'; // Receiver Email ID, Replace with your email ID
		$subject="Creinfor Page - $name" ;
		$subjectR='Bienvenido a Crienfor';
		$message="Nombre :".$name."\n"."Teléfono :".$phone."\n"."Correo :".$email."\n"."Mensaje :"."\n\n".$msg;
		$messageR="\n"."Hola ". $name . ", ". "Nosotros somos Creinfor -  Creatividad Informática.\n"."Mi nombre es José Luis, pertenesco al área comercial de la empresa y estaré a cargo de tu atención. \n"."Pronto me pondré en contacto contigo. Puedes comunicarte a este correo o en al número telefónico 975393900 Perú. \n \n". "Saludos cordiales.\n" . "Area Comercial - Creinfor";
		$messageR11 = "Hola $name".','."\n"."<br/>";
		$messageR12 = 'Nosotros somos Creinfor -  Creatividad Informática'."\n"."<br/>";
		$messageR13 = 'Mi nombre es José Luis, pertenesco al área comercial de la empresa y estaré a cargo de tu atención.'."\n"."<br/>";
		$messageR14 = 'Pronto me pondré en contacto contigo. Puedes comunicarte conmigo a este correo ó al número telefónico 975393900 Perú.'."\n"."<br/>"."<br/>";
		$messageR15 = 'Saludos cordiales.';
		$messageR16 = 'Área Comercial - Creinfor'."<br/>";
		$messageR2 = <<<EOD
		<html lang=es>
		<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head>
		<body>
		<div style="color: #1145AC; font: Helvetica 12pt;">
		<table  cellpadding="1" cellspacing="0" style="width:auto">
		<tr><td><img align="middle" src="http://www.creinfor.com/images/logo10.png" alt="Creinfor"></td></tr>
		<tr><td><strong>$messageR11 <br></br></td></tr>
		<tr><td>$messageR13</td></tr>
		<tr><td>$messageR14 <br></br></td></tr>
		<tr><td>$messageR15</td></tr>
		<tr><td>$messageR16 <br></br></td></tr>
		<tr><td><label>Visita nuestra página web:</label>&nbsp; &nbsp;<a href='http://www.crinfor.com'>www.creinfor.com</a></td></tr>
		</table>
		</div>
		</body>
		</html>
		EOD;
		$headers= "From: $from";
		//$headers= "From: ".'"José Luis Peñaloza" <'.$from'>';
		//$headers .= 'Cc: jose.penaloza@creinfor.com' . "\r\n";
		$headersR= "Content-Type: text/html; charset=UTF-8\r\n";
		$headersR .= "Cc: area.comercial@creinfor.com\r\n";
		$headersR.="From: ".'"Creinfor - José Luis Peñaloza" <'."$fromR".'>';		
		mail($email,$subjectR,$messageR2,$headersR);
		if(mail($to, $subject, $message, $headers)){
			$responseArray = array('state' => 'ok');
		}
		else{
			$responseArray = array('state' => 'danger');		
		}
	
	if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
		$encoded = json_encode($responseArray, JSON_FORCE_OBJECT);
		header('Content-Type: application/json');
		echo $encoded;
	}
die;

/*


<?php
		$name=$_POST['name'];
		$email=$_POST['email'];
		$phone=$_POST['phone'];
		$msg=$_POST['msg'];
		$from='creinforWP@creinfor.com';
		$fromR='jose.penaloza@creinfor.com';
		$to='jpenalozay@gmail.com'; // Receiver Email ID, Replace with your email ID
		$subject="Creinfor Page - $name";
		$subjectR='Bienvenido a Creinfor';
		$messageR11 = "Hola $name.";
		$messageR12 = 'Nosotros somos Creinfor -  Creatividad Informática';
		$messageR13 = 'Mi nombre es José Luis, pertenesco al área comercial de la empresa y estaré a cargo de tu atención.';
		$messageR14 = 'Pronto me pondré en contacto contigo. Puedes comunicarte a este correo o al número telefónico 975393900 Perú.';
		$messageR15 = 'Saludos cordiales.';
		$messageR16 = 'Area Comercial - Creinfor';
		$message="Nombre :".$name."\n"."Teléfono :".$phone."\n"."Correo :".$email."\n"."Mensaje :"."\n\n".$msg;				
		$headers="From: ".$from;
		$headersR = 'MIME-Version: 1.0' . "\r\n";
		$headersR .= "Content-Type: text/html; charset=ISO-8859-1\r\n";		
		$headersR .= "From: $fromR";	
		$messageR2 = <<<EOT
		<html lang=es>
		<head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"></head>
		<body>
		<table rules="all" style="border-color: #FFFFFF" cellpadding="10">		
		<tr><td><img align="middle" src="http://www.creinfor.com/images/logo.png"></td></tr>
		<tr><td><strong>".$messageR11."</td></tr>
		<tr><td>$messageR13</td></tr>		
		<tr><td>$messageR14</td></tr>
		<tr><td>$messageR15</td></tr>				
		<tr><td>$messageR16</td></tr>
		<tr><td><label>Visita nuestra página web: </label><a href='http://www.crinfor.com'>www.creinfor.com</a></td></tr>
		</table>
		</body>
		</html>
		EOT;
		
		mail($email, $subjectR, $messageR2, $headersR);
		if(mail($to, $subject, $message, $headers)){
			$responseArray = array('state' => 'ok');
		}
		else{
			$responseArray = array('state' => 'danger');		
		}
		
	if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
		$encoded = json_encode($responseArray, JSON_FORCE_OBJECT);
		header('Content-Type: application/json');
		echo $encoded;
	}

	
		
die;
*/