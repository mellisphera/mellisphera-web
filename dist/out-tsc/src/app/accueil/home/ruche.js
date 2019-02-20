var Ruche = /** @class */ (function () {
    function Ruche(id, name, description, username, idApiary, hivePosX, hivePosY) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.username = username;
        this.idApiary = idApiary;
        this.hivePosX = hivePosX;
        this.hivePosY = hivePosY;
    }
    Ruche.prototype.toString = function () {
        return this.name + " : " + this.description;
    };
    Ruche.prototype.setX = function (x) {
        this.hivePosX = x;
    };
    Ruche.prototype.setY = function (y) {
        this.hivePosY = y;
    };
    Ruche.prototype.getId = function () {
        return this.id;
    };
    return Ruche;
}());
export { Ruche };
//# sourceMappingURL=ruche.js.map