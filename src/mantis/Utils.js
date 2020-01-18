
Ext.define('Ext.ux.mantis.Utils', 
{
    singleton: true,
    alias: 'MantisUtils',
    alternateClassName: 'MantisUtils',

    versionCache: null,

    buildVersionCache: function()
    {
        //
        // Build utility version cache
        //
    
        return new Ext.Promise(function(resolve, reject)
        {
            if (!Ext.manifest.mantis || !Ext.manifest.mantis.location || !Ext.manifest.mantis.project_name)
            {
                Ext.csi.Utilities.Promises.emptySuccess()
                .then(function()
                {
                    Ext.csi.Utilities.alertError("Ext.manifest.mantis.location || Ext.manifest.mantis.project_name " +
                                                "must be set prior to calling this function");
                    reject([]);
                });
            }
            else if (!Ext.csi.Utilities.versionCache)
            {
                var url = Ext.manifest.mantis.location + 'plugins/Releases/api/releases/' + Ext.manifest.mantis.project_name;
                Ext.csi.Utilities.Promises.ajaxRequest(url, null, null, false, null,
                {
                    Authorization: Ext.manifest.mantis.token
                }, 'GET')
                .then(function(obj)
                {
                    var jso = Ext.util.JSON.decode(obj.response.responseText);
                    if (jso.projects && jso.projects[0] && jso.projects[0].versions) 
                    {
                        Ext.csi.Utilities.versionCache = [];
                        var versions = jso.projects[0].versions;
                        for (var v in versions)
                        {
                            if (versions[v].released === true) { // version are sorted newest to oldest
                                Ext.csi.Utilities.versionCache.push(versions[v].name);
                            }
                        }
                        resolve(Ext.csi.Utilities.versionCache);
                    }
                    else {
                        Ext.csi.Utilities.alertError("Could not retrieve changelog");
                        reject([]);
                    }
                })
                .catch(function()
                {
                    Ext.csi.Utilities.alertError("Error retrieving changelog");
                    reject([]);
                });
            }
            else
            {
                Ext.csi.Utilities.Promises.emptySuccess()
                .then(function()
                {
                    resolve(Ext.csi.Utilities.versionCache);
                });
            }
        });
    },


    getVersionNext: function(version)
    {
        if (Ext.csi.Utilities.versionCache)
        {
            for (var v in Ext.csi.Utilities.versionCache)
            {
                if (Ext.csi.Utilities.versionCache[v] === version) { // version are sorted newest to oldest
                    var vn = parseInt(v) - 1;
                    if (vn >= 0) {
                        return Ext.csi.Utilities.versionCache[vn];
                    }
                }
            }
        }
        else {
            Ext.csi.Utilities.alertError("Utils.buildVersionCache() must be called prior to calling this function");
        }
        
        return version;
    },


    getVersionPrevious: function(version)
    {
        if (Ext.csi.Utilities.versionCache)
        {
            for (var v in Ext.csi.Utilities.versionCache)
            {
                if (Ext.csi.Utilities.versionCache[v] === version) { // version are sorted newest to oldest
                    var vn = parseInt(v) + 1;
                    if (vn < Ext.csi.Utilities.versionCache.length) {
                        return Ext.csi.Utilities.versionCache[vn];
                    }
                }
            }
        }
        else {
            Ext.csi.Utilities.alertError("Utils.buildVersionCache() must be called prior to calling this function");
        }
        
        return version;
    },


    getChangeLog: function(version)
    {
        return new Ext.Promise(function(resolve, reject)
        {
            if (!Ext.manifest.mantis || !Ext.manifest.mantis.location || !Ext.manifest.mantis.project_name)
            {
                Ext.csi.Utilities.Promises.emptySuccess()
                .then(function()
                {
                    Ext.csi.Utilities.alertError("Ext.manifest.mantis.location || Ext.manifest.mantis.project_name " +
                                                "must be set prior to calling this function");
                    reject([]);
                });
                return;
            }

            var url = Ext.manifest.mantis.location + 'plugins/Releases/api/releases/' + Ext.manifest.mantis.project_name + '/changelog/' + version;
            Ext.csi.Utilities.Promises.ajaxRequest(url, null, null, false, null,
            {
                Authorization: Ext.manifest.mantis.token
            }, 'GET')
            .then(function(obj)
            {
                var jso = Ext.util.JSON.decode(obj.response.responseText);
                if (jso.changelog) 
                {
                    var cl = jso.changelog.replace(/<a[^>]*>/gi, '').replace(/<\/a>/gi, '').replace(/<table/gi, '<table cellpadding="8"');
                    resolve(cl);
                }
                else if (jso.changelog === '' || jso.changelog === false) {
                    resolve('');
                }
                else {
                    Utils.alertError("Could not retrieve changelog");
                    reject('');
                }
            })
            .catch(function(obj)
            {
                Utils.alertError("Error retrieving changelog");
                reject(obj);
            });
        });
    }
});
