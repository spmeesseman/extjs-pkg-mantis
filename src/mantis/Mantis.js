Ext.define('Ext.ux.mantis.Mantis', 
{
    singleton: true,
    alias: 'Mantis',
    alternateClassName: 'Mantis',

    require: [ 'Ext.util.Cookies' ],

    logger: null,
    token: null,
    project: null,

    createIssue: function()
    {
        var me = this;

        if (!me.token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return;
        }

        if (!me.project) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return;
        }
    },

    createRelease: function(tag)
    {
        var me = this;

        if (!me.token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return;
        }

        if (!me.project) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return;
        }
    },

    
    parseMantisRsp: function(response)
    {
        var json;
        try {
            if (response.responseText) {
                json = Ext.util.JSON.decode(response.responseText);
            }
            else if (response) {
                json = Ext.util.JSON.decode(response);
            }
        } 
        catch(e) {
            Utils.alertError("An error occurred executing the Mantis RPC - Could not decode response");
            return [];
        }
        //
        // Read the JSON result
        //
        if (!json) {
            Utils.alertError("An error occurred executing the Mantis RPC");                          
            return [];
        }
        //
        // Make sure the server returned success
        //
        if (json.error) {
            Utils.alertError("An error occurred executing the Mantis RPC.<br><br>Code:   " + json.error.code +
                                "<br>Name:    " + json.error.name + "<br>Message: " + json.error.message);                          
            return [];
        }
        if (!json.result) {
            Utils.alertError("An error occurred executing the Mantis RPC - Invalid result");                          
            return [];
        }
        if (!json.hasOwnProperty("id")) {
            Utils.alertError("An error occurred executing the Mantis RPC - Invalid id");                          
            return [];
        }

        return json.result;
    },


    getTickets: function()
    {
        var me = this;
        var deferred = new Ext.Deferred();

        if (!me.token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return Ext.Deferred.reject("Invalid token");
        }

        if (!me.project) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return Ext.Deferred.reject("Invalid project");
        }

        Ext.Ajax.request(
        {
            scope: this,
            url: 'https://app1.development.pjats.com/projects/api/rest/issues',
            method: 'GET',
            //withCredentials: true,
            useDefaultXhrHeader: false,
            headers:
            {
                Authorization: Mantis.token
            },
            jsonData:
            {
                params: [ "status!=closed" ],
                method: "ticket.query",
                max: 0,
                page: 1
            },
            success: function(response, options)
            {  
                //
                // Example response (array) (1 item)
                //
                // {
                //    "issues": [
                //    {
                //       "id": 35,
                //       "summary": "Document Normals",
                //       "description": "Document Normals View",
                //       "project": {
                //           "id": 1,
                //           "name": "GEMS2"
                //       },
                //       "category": {
                //           "id": 1,
                //           "name": "General"
                //       },
                //       "version": {
                //           "id": 1,
                //           "name": "1.5.4"
                //       },
                //       "target_version": {
                //           "id": 5,
                //           "name": "1.8.0"
                //       },
                //       "reporter": {
                //           "id": 2,
                //           "name": "smeesseman",
                //           "real_name": "Scott Meesseman",
                //           "email": "smeesseman@pjats.com"
                //       },
                //       "status": {
                //           "id": 10,
                //           "name": "new",
                //           "label": "new",
                //           "color": "#fcbdbd"
                //       },
                //       "resolution": {
                //           "id": 10,
                //           "name": "open",
                //           "label": "open"
                //       },
                //       "view_state": {
                //           "id": 10,
                //           "name": "public",
                //           "label": "public"
                //       },
                //       "priority": {
                //           "id": 30,
                //           "name": "normal",
                //           "label": "normal"
                //       },
                //       "severity": {
                //           "id": 10,
                //           "name": "feature",
                //           "label": "feature"
                //       },
                //       "reproducibility": {
                //           "id": 100,
                //           "name": "N\/A",
                //           "label": "N\/A"
                //       },
                //       "sticky": false,
                //       "created_at": "2019-06-16T14:16:55-04:00",
                //       "updated_at": "2019-06-16T14:16:55-04:00",
                //       "custom_fields": [
                //           {
                //           "field": {
                //               "id": 1,
                //               "name": "Type"
                //           },
                //           "value": "feature"
                //           }
                //       ],
                //       "history": [
                //           {
                //           "created_at": "2019-06-16T14:16:55-04:00",
                //           "user": {
                //               "id": 2,
                //               "name": "smeesseman",
                //               "real_name": "Scott Meesseman",
                //               "email": "smeesseman@pjats.com"
                //           },
                //           "type": {
                //               "id": 1,
                //               "name": "issue-new"
                //           },
                //           "message": "New Issue"
                //           }
                //       ]
                //    }] 
                // }
                //            
                var ticketIds = me.parseMantisRpcRsp(response);
                if (ticketIds.length > 0)
                {
                    var tId = 0;
                    var tickets = [];
                    function _getTicket(id)
                    {
                        me.getTicket(id).then((ticket) =>
                        {
                            if (tId < ticketIds.length - 1) 
                            {
                                tickets.push(ticket);
                                _getTicket(ticketIds[++tId]);
                            }
                            else {
                                deferred.resolve(tickets);
                            }
                        },
                        (e) => { deferred.reject(e); });
                    }
                    _getTicket(ticketIds[tId]);
                }
            },
            failure: function(response, options)
            {
                deferred.reject('Could not execute Mantis RPC');
            }
        });

        return deferred.promise;
    },


    getTicket: function(id)
    {
        var me = this;
        var deferred = new Ext.Deferred();

        if (!me.token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return Ext.Deferred.reject("Invalid token");;
        }

        if (!me.project) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return Ext.Deferred.reject("Invalid project");
        }

        Ext.Ajax.request(
        {
            scope: this,
            url: 'https://app1.development.pjats.com/projects/gems2/login/rpc',
            //withCredentials: true,
            useDefaultXhrHeader: false,
            headers:
            {
                Authorization: Mantis.token
            },
            jsonData:
            {
                params: [ id ],
                method: "ticket.get"
            },
            success: function(response, options2)
            {
                var MantisTicket = me.parseMantisRpcRsp(response);
                //
                // Mantis Ticket response = 4 part array
                //
                //     [0] : id
                //     [1] : date
                //     [2] : date
                //     [3] : ticketinfo
                //
                var ticket = GEMS.model.Mantis.Ticket.createWithId(id,
                {
                    cc: MantisTicket[3].cc,
                    component: MantisTicket[3].component,
                    description: MantisTicket[3].description,
                    keywords: MantisTicket[3].keywords,
                    milestone: MantisTicket[3].milestone,
                    owner: MantisTicket[3].owner,
                    priority: MantisTicket[3].priority,
                    reporter: MantisTicket[3].reporter,
                    resolution: MantisTicket[3].resolution,
                    status: MantisTicket[3].status,
                    summary: MantisTicket[3].summary,
                    ticketsboard: MantisTicket[3].ticketsboard,
                    type: MantisTicket[3].type,
                    version: MantisTicket[3].version,
                    _ts: MantisTicket[3]._ts,
                    changetime: new Date(MantisTicket[3].changetime.__jsonclass__[1]),
                    due_date: new Date(MantisTicket[3].due_date.__jsonclass__[1]),
                    time: new Date(MantisTicket[3].time.__jsonclass__[1])
                });

                deferred.resolve(ticket);

            },
            failure: function(response, options)
            {
                deferred.reject('Could not execute Mantis RPC');
            }
        });

        return deferred.promise;
    }
});
