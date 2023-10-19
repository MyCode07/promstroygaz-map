<?php
require_once($_SERVER['DOCUMENT_ROOT']. "/bitrix/modules/main/include/prolog_before.php");

$region_html = '';

if (!empty($_POST['id'])){

    $arFilter=array(
        "IBLOCK_ID" => 3,
        'SECTION_ID'=> $_POST['district_id'],
        "ID" => $_POST['id'],
    );

    $ar_result=Array();
    $arProj = CIBlockSection::GetList(array("SORT"=>"ASC"),$arFilter,false);

    while($projRes = $arProj->GetNextElement()){
        $arFields = $projRes->GetFields();
        $ar_result[$arFields["ID"]]["NAME"] = $arFields["NAME"];
    }	

    foreach($ar_result as $arrkey => $arrvalue){
        $arProjElem = CIBlockElement::GetList(array(),array("SECTION_ID"=>$arrkey),false);

        while($projResElem = $arProjElem->GetNextElement()){
            $arElemFields = $projResElem->GetFields();

            $arSelFlds["NAME"] = $arElemFields["NAME"];

            $url_res = CIBlockElement::GetProperty(3, $arElemFields["ID"], array(), array('CODE'=>'MAIN_DOMAIN'));
            $url = $url_res->Fetch();
            $arSelFlds["MAIN_DOMAIN"] = $url['VALUE'];

            $phone_res = CIBlockElement::GetProperty(3, $arElemFields["ID"], array(), array('CODE'=>'PHONES'));
            $phone = $phone_res->Fetch();
            $arSelFlds["PHONE"] = $phone['VALUE'];

            $address_res = CIBlockElement::GetProperty(3, $arElemFields["ID"], array(), array("CODE"=>"ADDRESS"));
            $address = $address_res->Fetch();
            $arSelFlds["ADDRESS"] = $address['VALUE']['TEXT'];

            $ar_result[$arrkey]["ITEMS"][] = $arSelFlds;
        }
    }

    foreach($ar_result as $key => $arrValues){
        // "<h4>".$arrValues["NAME"]."</h4>";
        if(is_array($arrValues["ITEMS"]) && count($arrValues["ITEMS"]) > 0){
            foreach ($arrValues["ITEMS"] as $arrItem){
                $region_html .= '<li><a href="https://'.$arrItem["MAIN_DOMAIN"].'" target="_blank"><label>'.$arrItem["NAME"].'</label><p><span>'.$arrItem["ADDRESS"].'</span><span>'.$arrItem["PHONE"].'</span></p><div class="icon"></div></a></li>'; 
            }		
        }
    }	
}
else{
    $region_html = "В свойствах страницы не указан ID раздела с элементами";
}

$result = [
    'isSuccess' => true,
    'text' => $region_html,
];

header("Content-type: text/html; charset=utf-8");
echo json_encode($result);