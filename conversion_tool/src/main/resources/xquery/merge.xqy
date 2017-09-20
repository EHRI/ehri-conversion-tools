xquery version "3.0";

declare variable $file1 as xs:string external;
declare variable $file2 as xs:string external;
declare variable $file1_column as xs:string external;
declare variable $file2_column as xs:string external;
declare variable $output_folder as xs:string external;


declare function local:append_child($node as item(), $child as item()*){
    let $insert := %updating function($node, $child) { insert node $child into $node }
return $node update (updating $insert(., $chld))
};

declare function local:remove_child($node as item(), $entry as xs:string){
let $delete-node := %updating function($node, $entry) {delete node $node/entry[@name=$entry] }
return $node update (updating $delete-node(., $entry))
};

declare function local:parse-json($json as xs:string) as item() {
json:parse($json, map { "format": "attributes" })
};

declare function local:parse-csv($csv as xs:string) as item() {
csv:parse($csv, map { "format": "attributes", "separator": "comma", "header": "yes" })
};

declare function local:parse-tsv($tsv as xs:string) as item() {
csv:parse($tsv, map { "format": "attributes", "separator": "tab", "header": "yes" })
};

declare function local:nest-obj($xml as item()*, $obj as item()*, $left_col as xs:string, $right_col as xs:string) as item()* {
let $right_id := $obj/entry[@name=$right_col]/text()
let $join     := $xml/csv/record[entry/@name=$left_col and entry/text()=$right_id]
for $x in $join
return  local:append_child($x, local:remove_child($obj, $right_col))
};

declare function local:get-nested($f1, $f2, $file1_column, $file2_column){
for $x in $f2/csv/record
return local:nest-obj($f1, $x, $file1_column, $file2_column)
};

let $f1 := local:parse-csv(file:read-text($file1))
let $f2 := local:parse-csv(file:read-text($file2))

let $output := ( <csv>{
local:get-nested($f1, $f2, $file1_column, $file2_column),
$f1/csv/record[entry/@name=$file1_column and not(entry/text() = $f2/csv/record/entry[@name=$file2_column]/text())]}
</csv>
)

return file:write($output_folder, $output)


