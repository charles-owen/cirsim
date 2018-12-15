<?php
require __DIR__ . '/Cirsim/ApiDemo.php';

/**
 * @file
 *
 * Demonstration of Cirsim API
 */

//header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Methods: POST,GET,OPTIONS,PUT,DELETE");
//header("Access-Control-Allow-Headers: Content-Type,Accept,Authorization");
//header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//print_r(apache_request_headers());

session_start();

define('API_SESSION', 'cirsim_api_session1');
if(!isset($_SESSION[API_SESSION])) {
	$_SESSION[API_SESSION] = new Cirsim\ApiDemo();
}

$api = $_SESSION[API_SESSION];

//if(isset($_GET['cmd']) && $_GET['cmd'] === 'files') {
//	echo json_encode(['data'=>[
//		['type'=>'file', 'id'=>12, 'attributes'=>['name'=>'File 1'] ],
//		['type'=>'file', 'id'=>27, 'attributes'=>['name'=>'File 2'] ]
//	]]);
//	return;
//}

$cmd = !empty($_GET['cmd']) ? $_GET['cmd'] : (!empty($_POST['cmd']) ? $_POST['cmd'] : '');
$cmd = strip_tags($cmd);

switch($cmd) {
	case 'files':
		$files = $api->dir();
		$data = [];
		foreach($files as $file) {
			$data[] = ['type'=>'file', 'id'=>0, 'attributes'=>['name'=>$file] ];
		}
		echo json_encode(['data'=>$data]);
		break;

	case 'save':
		$api->save(strip_tags($_POST['name']), strip_tags($_POST['data']));
		echo '{}';
		break;

	case 'open':
		$file = $api->open(strip_tags($_GET['name']));
		if($file === null) {
			echo json_encode(['errors' => [
				['status'=>401, 'title'=>'Server Error', 'detail'=>"File $file does not exist."]
			]]);
			break;
		}

		$data[] = ['type'=>'file', 'id'=>0, 'attributes'=>['name'=>$file, 'data'=>$file] ];
		echo json_encode(['data'=>$data]);
		break;

	case '':
		echo json_encode(['errors' => [
			['status'=>401, 'title'=>'Server Error', 'detail'=>'Missing command']
		]]);
		break;

	default:
		echo json_encode(['errors' => [
			['status'=>401, 'title'=>'Server Error', 'detail'=>'Unknown command']
		]]);
		break;
}

