
Ext.define('Ext.ux.mantis.Utils', 
{
    singleton: true,
    alias: 'MantisUtils',
    alternateClassName: 'MantisUtils',

    versionCache: null,

    buildVersionCache: function(options)
    {
        //
        // Build utility version cache
        //
        return new Ext.Promise(function(resolve, reject)
        {
            if (!options.token || !options.location || !options.project_name)
            {
                Ext.csi.Utilities.alertError("location || project_name || token " +
                                                "must be set prior to calling this function");
                reject([]);
            }
            else if (!MantisUtils.versionCache)
            {
                Ext.Ajax.request(
                {
                    url: options.location + 'plugins/Releases/api/releases/' + options.project_name,
                    headers: {
                        Authorization: options.token
                    }
                })
                .then(function(response)
                {
                    var jso = response.responseJson ? response.responseJson :
                             response.responseText ? Ext.util.JSON.decode(response.responseText) : null;
                    if (jso.projects && jso.projects[0] && jso.projects[0].versions) 
                    {
                        MantisUtils.versionCache = [];
                        var versions = jso.projects[0].versions;
                        for (var v in versions)
                        {
                            if (versions[v].released === true) { // version are sorted newest to oldest
                                MantisUtils.versionCache.push(versions[v].name);
                            }
                        }
                        resolve(MantisUtils.versionCache);
                    }
                    else {
                        Ext.Msg.alert("Could not retrieve changelog");
                        reject([]);
                    }
                })
                .catch(function()
                {
                    Ext.Msg.alert("Error retrieving changelog");
                    reject([]);
                });
            }
            else
            {
                resolve(MantisUtils.versionCache);
            }
        });
    },


    getVersionNext: function(version, options)
    {
        if (MantisUtils.versionCache)
        {
            for (var v in MantisUtils.versionCache)
            {
                if (MantisUtils.versionCache[v] === version) { // version are sorted newest to oldest
                    var vn = parseInt(v) - 1;
                    if (vn >= 0) {
                        return MantisUtils.versionCache[vn];
                    }
                }
            }
        }
        else if (options.logFn) {
            options.logFn("Utils.buildVersionCache() must be called prior to calling this function");
        }
        
        return version;
    },


    getVersionPrevious: function(version, options)
    {
        if (MantisUtils.versionCache)
        {
            for (var v in MantisUtils.versionCache)
            {
                if (MantisUtils.versionCache[v] === version) { // version are sorted newest to oldest
                    var vn = parseInt(v, 10) + 1;
                    if (vn < MantisUtils.versionCache.length) {
                        return MantisUtils.versionCache[vn];
                    }
                }
            }
        }
        else if (options.logFn) {
            options.logFn("Utils.buildVersionCache() must be called prior to calling this function");
        }
        
        return version;
    },


    getChangeLog: function(version, options)
    {
        if (options.logFn) {
            options.logFn('[Mantis] Get changelog start async', 1);
        }

        return new Ext.Promise(function(resolve, reject)
        {
            if (!options.token || !options.location || !options.project_name)
            {
                if (options.logFn) {
                    options.logFn("options.location || options.project_name " +
                                    "must be set prior to calling this function");
                }
                reject([]);
            }

            Ext.Ajax.request(
            {
                url: options.location + 'plugins/Releases/api/releases/' + options.project_name + '/changelog/' + version,
                headers: {
                    Authorization: options.token
                }
            })
            .then(function(response)
            {
                var jso = response.responseJson ? response.responseJson :
                          response.responseText ? Ext.util.JSON.decode(response.responseText) : null;
                if (jso && jso.changelog) 
                {
                    var cl = jso.changelog.replace(/<a[^>]*>/gi, '').replace(/<\/a>/gi, '').replace(/<table/gi, '<table cellpadding="8"');
                    resolve(cl);
                }
                else if (jso && (jso.changelog === '' || jso.changelog === false)) {
                    resolve('');
                }
                else if (options.logFn) {
                    options.logFn("Could not retrieve changelog");
                    Ext.Msg.alert("Error retrieving changelog");
                    reject(response);
                }
            })
            .catch(function(response)
            {
                if (options.logFn) {
                    options.logFn("Error retrieving changelog");
                    Ext.Msg.alert("Error retrieving changelog");
                }
                reject(response);
            });
        });
    }
});
