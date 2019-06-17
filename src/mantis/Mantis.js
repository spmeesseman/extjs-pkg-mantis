Ext.define('Ext.ux.mantis.Mantis', 
{
    singleton: true,
    alias: 'Mantis',
    alternateClassName: 'Mantis',

    require: [ 'Ext.util.Cookies' ],

    user: 'smeesseman',
    password: '',
    repository: null,
    logger: null,

    privates:
    {
        _authenticated: false
    },


    authenticate: function(request) 
    {
        var me = this;
        var deferred = new Ext.Deferred();

        if (!me._authenticated)
        {
            var matches = document.cookie.match(/Mantis_auth="(.*)"/);
            if (matches && matches.length > 0) {
                console.log("COOKIE EXISTS");
                return Ext.Deferred.resolved(true);
            }

            Ext.Ajax.request(
            {
                scope: this,
                url: 'https://app1.development.pjats.com/projects/gems2/login',
                withCredentials: true,
                useDefaultXhrHeader: false,
                success: function(response, options)
                {               
                    matches = response.responseText.match(/name="__FORM_TOKEN" value="(.*)" /);
                    if (matches.length === 2) 
                    {
                        Ext.Ajax.request(
                        {
                            scope: this,
                            url: 'https://app1.development.pjats.com/projects/gems2/login',
                            method: 'POST',
                            withCredentials: true,
                            useDefaultXhrHeader: false,
                            params:
                            {
                                __FORM_TOKEN: matches[1],
                                username: Mantis.user,
                                password: Mantis.password,
                                submit: 'Login'
                            },
                            success: function(response2, options2)
                            {               
                                deferred.resolve(true);
                            },
                            failure: function(response2, options2)
                            {
                                deferred.reject('Authentication failed (POST)');
                            }
                        });
                    }
                    else {
                        deferred.reject('Authentication failed (GET1)');
                    }
                },
                failure: function(response, options)
                {
                    //
                    // Failed to retrieve the Login page
                    //
                    // This is probably because a session already exists, we can resolve()
                    //
                    // Note that a CORS error is thrown here as requesting the login page redirects to
                    // '/', with an origin of 'null' in the response header (have not looked into)
                    // Seems it is safe to ignore, for correct operation
                    //
                    //deferred.reject('Authentication failed (GET0)');
                    deferred.resolve(true);
                }
            });
        }
        else {
            return Ext.Deferred.resolved(true);
        }

        return deferred.promise;
    },

    
    createIssue: function()
    {
        var me = this;

        if (!me.repository) {
            if (me.logger) {
                me.logger.error("Invalid repository");
            }
            return;
        }
    },

    createRelease: function(tag)
    {
        var me = this;

        if (!me.repository) {
            if (me.logger) {
                me.logger.error("Invalid repository");
            }
            return;
        }
    },

    
    parseMantisRpcRsp: function(response)
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

        me.authenticate().then((token) => {
        Ext.Ajax.request(
        {
            scope: this,
            url: 'https://app1.development.pjats.com/projects/gems2/login/rpc',
            method: 'POST',
            withCredentials: true,
            userName: Mantis.user,
            password: Mantis.password,
            useDefaultXhrHeader: false,
            headers:
            {
                Authorization: 'Basic ' + btoa(Mantis.user + ':' + Mantis.password)
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
        }); }, (e) => { deferred.reject(e); });

        return deferred.promise;
    },


    getTicket: function(id)
    {
        var me = this;
        var deferred = new Ext.Deferred();

        Ext.Ajax.request(
        {
            scope: this,
            url: 'https://app1.development.pjats.com/projects/gems2/login/rpc',
            method: 'POST',
            withCredentials: true,
            userName: Mantis.user,
            password: Mantis.password,
            useDefaultXhrHeader: false,
            headers:
            {
                Authorization: 'Basic ' + btoa(Mantis.user + ':' + Mantis.password)
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
