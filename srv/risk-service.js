// Imports
const cds = require("@sap/cds");
// the service implementation with all service handlers

module.exports = cds.service.impl(async function () {
    // define constants for the risk and businesspartners entities from the risk-service.cds file

    const { Risks,BusinessPartners } = this.entities;
    // set criticality after a read operation on /risks

    this.after("READ",Risks, (data) => {
        const risks = Array.isArray(data) ? data : [data];
        
        risks.forEach((risk) => {
            if(risk.impact >= 100000 ) {
                risk.criticality = 1;
            } else {
                risk.criticality = 2;
            }
        });
    });

    const BPsrv = await cds.connect.to("API_BUSINESS_PARTNER");

    this.on("READ", BusinessPartners, async (req) => {
        // The API Sandbox returns alot of business partners with empty names.
        // We don't want them in our application
        req.query.where("LastName <> '' and FirstName <> '' ");
        return await BPsrv.transaction(req).send({
        query: req.query,
        headers: {
        apikey: process.env.apikey,
        },
        });
        });

        this.on("READ", Risks, async (req, next) => {
            /*
            Check whether the request wants an "expand" of the business partner
            As this is not possible, the risk entity and the business partner
            entity are in different systems (SAP BTP and S/4 HANA Cloud),
            if there is such an expand, remove it
            */
            const expandIndex = req.query.SELECT.columns.findIndex(
            ({ expand, ref }) => expand && ref[0] === "bp"
            );
            console.log(req.query.SELECT.columns);
            // if (expandIndex < 0) retu
        if (expandIndex < 0) return next();
            req.query.SELECT.columns.splice(expandIndex, 1);
            if (
            !req.query.SELECT.columns.find((column) =>
            column.ref.find((ref) => ref == "bp_BusinessPartner")
            )
            ) {
            req.query.SELECT.columns.push({ ref: ["bp_BusinessPartner"] });
            }
            try {
                const res = await next();
                await Promise.all(
                res.map(async (risk) => {
                const bp = await BPsrv.transaction(req).send({
                query: SELECT.one(this.entities.BusinessPartners)
                .where({ BusinessPartner: risk.bp_BusinessPartner })
                .columns(["BusinessPartner", "LastName", "FirstName"]),
                headers: {
                apikey: process.env.apikey,
                },
                });
                risk.bp = bp;
                })
                );
                } catch (error) {}
            });



});
