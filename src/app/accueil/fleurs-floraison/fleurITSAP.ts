export class FleurITSAP {
	private periodemin : number;
    private periodemax : number;
    private periodemind : string;
    private periodemaxd : string;
    private interet_pollen : string;
    private interet_nectar : string;
    private indice_confiance : string;

    public getPeriodemin(): number {
        return this.periodemin;
    }

    public setPeriodemin(periodemin: number): void {
        this.periodemin = periodemin;
    }

    public getPeriodemax(): number {
        return this.periodemax;
    }

    public setPeriodemax(periodemax: number): void {
        this.periodemax = periodemax;
    }

    public getPeriodemind(): string {
        return this.periodemind;
    }

    public setPeriodemind(periodemind: string): void {
        this.periodemind = periodemind;
    }

    public getPeriodemaxd(): string {
        return this.periodemaxd;
    }

    public setPeriodemaxd(periodemaxd: string): void {
        this.periodemaxd = periodemaxd;
    }

    public getInteret_pollen(): string {
        return this.interet_pollen;
    }

    public setInteret_pollen(interet_pollen: string): void {
        this.interet_pollen = interet_pollen;
    }

    public getInteret_nectar(): string {
        return this.interet_nectar;
    }

    public setInteret_nectar(interet_nectar: string): void {
        this.interet_nectar = interet_nectar;
    }

    public getIndice_confiance(): string {
        return this.indice_confiance;
    }

    public setIndice_confiance(indice_confiance: string): void {
        this.indice_confiance = indice_confiance;
    }

   }