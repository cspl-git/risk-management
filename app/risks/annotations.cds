// using RiskService as service from '../../srv/risk-service';
using RiskService from '../../srv/risk-service';
// Risk list report page
annotate RiskService.Risks with @(UI : {
HeaderInfo : {
TypeName : 'Risk',
TypeNamePlural : 'Risks',
Title : {
    $Type : 'UI.DataField',
    Value : title
},
Description : {

    $Type : 'UI.DataField',
    Value : descr
}

},

SelectionFields : [prio],
Identification : [{Value : title}],
// define the table columns
LineItem : [
    {Value : title},
    {Value : miti_ID},
    {Value : owner},
    {Value : bp_BusinessPartner},
    {
        Value : prio,
        Criticality : criticality
    },
    {
        Value : impact,
        Criticality : criticality
    }
]

});
annotate RiskService.Risks with @(UI : {
Facets : [{
$Type : 'UI.ReferenceFacet',
Label : 'Main',
Target : '@UI.FieldGroup#Main',
}],
FieldGroup #Main : {Data : [
{Value : miti_ID},
{Value : owner},
{Value : bp_BusinessPartner},
{
Value : prio,
Criticality : criticality
},
{
Value : impact,
Criticality : criticality
}
]},
});

