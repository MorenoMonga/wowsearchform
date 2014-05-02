<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<title>test: wow search form</title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="content-style-type" content="text/css" />
	<meta name="resource-type" content="document" />
	<meta name="description" content="wow search form build an advance html search form" />
	<meta name="keywords" content="wow, jquery, javascript, html, form, plugin, search" />
	<meta name="author" content="Moreno Monga" />
	<link rel="shortcut icon" href="favicon.png" />
	<link rel="stylesheet" type="text/css" href="page.css" /><link rel="stylesheet" href="highlight/styles/default.css"><!-- Page css. Please ignore. -->
</head>
<body>
<h1>DEMO: wow search form</h1>
<p>&nbsp;</p>

<h2>Data received</h2>
<p>
These are the data receveid from search form:
</p>
<p>
	<code>
	<pre><?php  print_r( $_POST); ?>  </pre>
	</code>

</p>
<p> ...now you can build your query  ;-)</p>

<p>&nbsp;</p>
<p>For example:</p>

	<?php
	$sql_where="";
	$logic = ( $_POST['logic'] == "OR" ? "OR" : "AND");
	foreach ( $_POST['field'] as $idx=>$field){
		$safe_field = sanitize($field);
		switch($_POST['operator'][$idx]){
			case 'LIKE':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` LIKE \"%". sanitize($_POST['value'][$idx])."%\"";
				break;
			//EQUAL
			case 'EQUAL':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` = \"". sanitize($_POST['value'][$idx])."\"";
				break;
			//begin
			case '_LIKE':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` LIKE \"". sanitize($_POST['value'][$idx])."%\"";
				break;
			//end
			case 'LIKE_':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` LIKE \"%". sanitize($_POST['value'][$idx])."\"";
				break;
			//
			case 'NOT':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` != \"". sanitize($_POST['value'][$idx])."\"";
				break;
			case 'NOT LIKE':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` NOT LIKE \"%". sanitize($_POST['value'][$idx])."%\"";
				break;

			//---- number ----------
			//EQUAL
			case '=':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` = \"". sanitize($_POST['value'][$idx])."\"";
				break;
			case '>':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` > ". sanitize($_POST['value'][$idx]);
				break;
			case '<':
				$sql_where .=  "`".$safe_field ."` < ". sanitize($_POST['value'][$idx]);
				break;
			case '!=':
				if(!empty($sql_where))
					$sql_where .= " ".$logic." ";
				$sql_where .=  "`".$safe_field ."` != \"". sanitize($_POST['value'][$idx])."\"";
				break;

		}
	}
	echo "<code style=\"font-size: 10px; color: blue;\">";
	print("SELECT * FROM mytable WHERE " . $sql_where . ";");
	echo "</code>";


	function sanitize($value){
		// WRITE HERE YOUR  sanitization CODE
		//...
		return ($value);
	}
	?>


<p>&nbsp;</p>
<p>
<a href="index.html">&laquo; Go back</a>
</p>


</body>
</html>
