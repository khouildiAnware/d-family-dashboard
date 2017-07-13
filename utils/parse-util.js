'use strict';

var Parse = require('parse/node');
var _ = require('lodash');
var Q = require('q');

function getChilds(categs,parent,childs)
{
      
    childs.push(parent);
    _.each(categs, function (item) 
    {
       


        if(item.get('parent')){
            if(item.get('parent').id == parent.id) 
            {
                childs.push(item);
               
                if(childs.lenght!=getChilds(categs,item,childs).lenght)
                {
                   childs= childs.concat(getChilds(categs,item,childs));

                }
            }
        }
        else
        {
            if(item.get('parent') == parent) 
            {
               childs.push(item);
               
                if(childs.lenght!=getChilds(categs,item,childs).lenght)
                {
                   childs= childs.concat(getChilds(categs,item,childs));

                }
            }

        }
   
    });

    
    return childs;
}

function readFields(obj, entity) {
    _.each(obj, function (value, key) {
        if (key == 'createdAt' || key == 'updatedAt') {
            return;
        }

        if (key.indexOf('_') === 0) {
            return;
        }

        if (typeof (value) === 'object') {
            if (value.className) {
                var Entity = Parse.Object.extend(value.className);
                var e = new Entity();
                e.id = value.objectId;
                entity.set(key, e);
            }
        }
        else {
            entity.set(key, value);
        }
    });
    
}

function readIncludes(req) {
    if (!req.query.include) {
        return [];
    }

    return req.query.include.split(',');
}

function handleParseError(err, res, next) {
    res.status(500);
    res.json({ error: err });
}

function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

var PagedResponse = function (className, req, res, next, callback) {
    var findQuery = new Parse.Query(className);
    var totalQuery = new Parse.Query(className);

    var page = parseInt(req.query.page, 10);
    var pageSize = parseInt(req.query.pageSize, 10);
    var search = req.query.search;
    var category=req.query.category;
    var filter = req.query.filter;
    var orQueries = [];
    var andQueries = [];
    var fn= function(){

    if (search) {
        var hash = {};
        var parts = search.split(',');
        _.each(parts, function (p) {
            var expr = p.split(':');
            hash[expr[0]] = expr[1];
        });

        _.each(hash, function (v, k) {
            var query = new Parse.Query(className);
            query.matches(k, '.*' + decodeURIComponent(v) + '.*');
            orQueries.push(query);
        });

        findQuery = Parse.Query.or.apply(null, orQueries);
        totalQuery = Parse.Query.or.apply(null, orQueries);
    }

    if (filter) {
        var hash = {};
        var parts = filter.split(',');
        _.each(parts, function (p) {
            var expr = p.split(':');
            hash[expr[0]] = expr[1];
        });

        _.each(hash, function (v, k) {

            if (k.indexOf('.') > 0) {
                var subQueryParts = k.split('.');
                var cls = subQueryParts[0];
                var field = subQueryParts[1];

                var subQuery = new Parse.Query(cls);
                subQuery.equalTo(field, v);

                findQuery.matchesQuery(toCamelCase(cls), subQuery);
                totalQuery.matchesQuery(toCamelCase(cls), subQuery);
            }
            else {
                findQuery.equalTo(k, decodeURIComponent(v));
                totalQuery.equalTo(k, decodeURIComponent(v));
            }
        });
    }

    var includes = readIncludes(req);
    findQuery.include(includes);

    var findPromise = findQuery.descending("createdAt");
    if (pageSize) {
        findPromise = findQuery.skip((page - 1) * pageSize)
            .limit(pageSize);
    }

    findPromise = findQuery.find();


    var totalPromise = totalQuery.count();

    return Q.all([findPromise, totalPromise]).then(function (r) {
        var result = r[0];
        var count = r[1];
        var output = { totalCount: count, items: result }
        if (callback) {
            callback(output);
        }
        else {
            res.json(output);
        }
    }, function (err) {
        next(err);
    });

}

    if(category){
        var categorys=null;
        var childs=[];
       PagedResponse('Category',{query:{includes:'parent'}},res,next,function(data){
            var parent= GetById('Category',category,{query:{includes:'parent'}},res,next,function(parent){
            
            categorys = getChilds(data.items,parent,childs);
            findQuery.containedIn("categ", categorys);
            totalQuery.containedIn("categ", categorys);
             fn();
             

            });
        });

        
        

    }
    else{
        fn();
    }

    
};

var GetById = function (className, id, req, res, next,callback) {
    var query = new Parse.Query(className);
    query.equalTo('objectId', id);

    var includes = readIncludes(req);
    query.include(includes);

    query.first({
        success: function (obj) {
            if(callback){
                callback(obj);
            }
            else
            {
                res.json(obj);
            }
        },
        error: function (res) {
            next(res);
        }
    });
};

var SaveProduct = function (className, obj, req, res, next) {
    var Entity = Parse.Object.extend(className);

    var newObj = new Entity();
    newObj.set("name",obj.name);
    newObj.set("nameAR",obj.nameAR);
    newObj.set("productDescription",obj.productDescription);
    newObj.set("productDescriptionAR",obj.productDescriptionAR);
    newObj.set("barcode",obj.barcode);
    newObj.set("quantity",parseInt(obj.quantity));
    newObj.set("price",parseInt(obj.price));
    /*var pictures = [];
   
        if(false)
        {

        }
        else
        {
            img = new Parse.File("myfile.txt", obj['files[0]']);
            console.log(obj['files[0]']);
            var pic = Parse.Object.extend("Picture");
            var picture=new pic();
            picture.set("full",img);
            picture.save(null, {
        success: function (r) {
            
        },
        error: function (r, error) {
           
        }
    });
            pictures.push(picture);


        }

    
    newObj.set("pictures",pictures);*/

    newObj.save(null, {
        success: function (r) {
            res.json(r);
        },
        error: function (r, error) {
            handleParseError(error.message, res, next);
        }
    });
};
var UpdateProduct = function (className, obj, req, res, next) {
    GetById(className, obj.objectId, req, res, next,function(newObj){
        newObj.set("name",obj.name);
    newObj.set("nameAR",obj.nameAR);
    newObj.set("productDescription",obj.productDescription);
    newObj.set("productDescriptionAR",obj.productDescriptionAR);
    newObj.set("barcode",obj.barcode);
    newObj.set("quantity",parseInt(obj.quantity));
    newObj.set("price",parseInt(obj.price));
    /*var pictures = [];
   
        if(false)
        {

        }
        else
        {
            img = new Parse.File("myfile.txt", obj['files[0]']);
            console.log(obj['files[0]']);
            var pic = Parse.Object.extend("Picture");
            var picture=new pic();
            picture.set("full",img);
            picture.save(null, {
        success: function (r) {
            
        },
        error: function (r, error) {
           
        }
    });
            pictures.push(picture);


        }

    
    newObj.set("pictures",pictures);*/

    newObj.save(null, {
        success: function (r) {
            res.json(r);
        },
        error: function (r, error) {
            handleParseError(error.message, res, next);
        }
    });

    });
    
};

var Save = function (className, obj, req, res, next) {
    var Entity = Parse.Object.extend(className);

    var newObj = new Entity();
    readFields(obj, newObj);

    newObj.save(null, {
        success: function (r) {
            res.json(r);
        },
        error: function (r, error) {
            handleParseError(error.message, res, next);
        }
    });
};

var Delete = function (className, id, req, res, next) {
    GetById(className,id,req,res,next,function(data){
        data.destroy({
  success: function(r) {
    res.json(r);
  },
  error: function(r, error) {
    handleParseError(error.message, res, next);
  }
});

    });
};

var SendPush = function (req, res, next) {
    var query = new Parse.Query(Parse.Installation);

    if (req.body.target !== 'All') {
        if (req.body.target === 'iOS') {
            query.equalTo('deviceType', 'ios');
        }
        else if (req.body.target === 'Android') {
            query.equalTo('deviceType', 'android');
        }
    }

    Parse.Cloud.useMasterKey();
    Parse.Push.send({
        where: query,
        data: { alert: req.body.notification }
    }, {
            success: function () {
                res.json({ success: true });
            },
            error: function (error) {
                res.json({ success: false, error: error });
            }
        });
};


module.exports = {
    PagedResponse: PagedResponse,
    getById: GetById,
    saveProduct: SaveProduct,
    updateProduct: UpdateProduct,
    save: Save,
    delete:Delete,
    sendPush: SendPush
};