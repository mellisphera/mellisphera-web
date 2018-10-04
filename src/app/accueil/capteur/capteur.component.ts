import { Component, OnInit } from '@angular/core';
import { CapteurService } from './capteur.service';
import { FormGroup,FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../ruche-rucher/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { Rucher } from '../ruche-rucher/rucher';
import { Ruche } from '../ruche-rucher/ruche';
import { Capteur } from './capteur';
import { Observable, Subscription } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../_shared-services/selected-rucher.service';

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.scss']
})
export class CapteurComponent implements OnInit {

  username: string;
  ruchers: any [] = [];
  capteurs : any[] = []; 
  sensors ;
  selectedRucher = new Rucher();
  selectedRuche = new Ruche();
  selectedRucherEdit = new Rucher();
  selectedRucheEdit = new Ruche();
  selectedCapteur = new Capteur();
  capteurEdit = new Capteur();
  //variable to store ruches
  ruches: any [] = [];
  //for new sensor
  newCapteurForm : FormGroup;
  //to edit a sensor
  editCapteurForm : FormGroup;
  capteur= new Capteur();
  reference ='';
  type='';
  description ='';
  descriptionE='';

  types : any[] = []; 

  radioStock :boolean;
  radioRuche : boolean;
  
  radioStockE :boolean;
  radioRucheE : boolean;

  message="";
  editedSensorMsg :boolean;
  editedSensorMsgE : boolean;
  public errorMsg;

  private timerSubscription: AnonymousSubscription;
  
    receiveMessage($event){
            this.message=$event;

    }
    
    constructor(    
                    private data : UserloggedService,
                    private _router : Router,
                    private formBuilder: FormBuilder,
                    public rucherService : RucherService,
                    public capteurService : CapteurService,
                    private _selectedRucherService : selectedRucherService, ) { 

        
        this.newCapteurForm=formBuilder.group({
                            'reference': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(20)])],
                            'type': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(400)])],
                            'description': [null],
                            'selectedRucher': [null],
                            'selectedRuche': [null],
                            'checkbox': [],
                            'validate' : ``
                        })                
                
        this.editCapteurForm=formBuilder.group({
                            'selectedRucher': [null],
                            'selectedRuche': [null],
                            'checkbox': [],
                            'description': [null],
                            'validate' : ``
                        })                
        this.username= data.currentUser().username;
        
    }


    ngOnInit() {
        //this.getUserRuchers(); 
        this.selectRadioStock();
        this.getAllCapteur();
        this.radioRucheE=false;
        this.radioStockE=true;
}

    selectRadioStock(){
        this.editedSensorMsg=false;
        this.radioRuche=false;
        this.radioStock=true;

        this.selectedRucher=null;
        this.selectedRuche=null;
        this.newCapteurForm.get('selectedRuche').clearValidators();
        this.newCapteurForm.get('selectedRuche').updateValueAndValidity();
        
    }

    selectRadioRuche(){
        this.radioRuche=true;
        this.radioStock=false;

        this.newCapteurForm.get('selectedRuche').setValidators([Validators.required]);
        this.newCapteurForm.get('selectedRuche').updateValueAndValidity();
    }

    selectRadioStockE(){
        this.editedSensorMsgE=false;
        this.radioRucheE=false;
        this.radioStockE=true;

        this.selectedRucherEdit=null;
        this.selectedRucheEdit=null;
        this.editCapteurForm.get('selectedRuche').clearValidators();
        this.editCapteurForm.get('selectedRuche').updateValueAndValidity();
        
    }

    selectRadioRucheE(){
        this.radioRucheE=true;
        this.radioStockE=false;

        this.editCapteurForm.get('selectedRuche').setValidators([Validators.required]);
        this.editCapteurForm.get('selectedRuche').updateValueAndValidity();
    }



    capteurForm(){
        this._router.navigate(['/nouveau-capteur']);
    }

    getAllCapteur(){
       
        this.capteurService.getUserCapteurs(this.username).subscribe(
          data => {this.capteurs=data;},
          err  => {});
       
    }

    selectCapteur(capteur){
        this.selectedCapteur=capteur;
        this.descriptionE = this.selectedCapteur.description;
        this.selectedRucherEdit.id = this.selectedCapteur.idApiary;
        this.selectedRucheEdit.id = this.selectedCapteur.idHive;
    }


    checkCapteurType(value : any){       
            this.capteurService.checkCapteurType(value).subscribe(
                data =>{ 
                    this.type=data;
                },
                ( error => this.errorMsg=error)
               );
    } 

   //CREATE CAPTEUR
    createCapteur(capteur){
        this.capteur.reference=this.reference;
        this.capteur.type=this.newCapteurForm.controls['type'].value;
        this.capteur.description=this.description;
        
        this.capteur.username = this.username;

        if(this.radioStock){
            this.capteur.idHive = "stock";
            this.capteur.idApiary = "stock";
        }else {
            var idRuche = String(this.selectedRuche);
            this.capteur.idHive = idRuche;
            this.capteur.idApiary = String(this.selectedRucher);
        }

        this.capteurService.createCapteur(this.capteur).subscribe( 
            data => { 
                alert("capteur créé ! ");
             },
             ( error => this.errorMsg=error)
        );
       
        this.resetCapteurForm();
        //location.reload();
        this.radioRuche=false;
        this.radioStock=true;
        
        alert("Votre Capteur a été créé");
        this.subscribeToData();
    }  


    //DELETE CAPTEUR

    deleteCapteur(capteur){
        this.selectedCapteur = capteur;
        if (confirm("Etes vous sure de vouloir supprimer : " + this.selectedCapteur.reference + "?")) {
          this.capteurService.deleteCapteur(this.selectedCapteur).subscribe(
              data => {},
               ( error => this.errorMsg=error));
        }
        this.subscribeToData();
     
    }

    updateCapteur(){
      
        if(this.radioStockE){
            this.selectedCapteur.idHive = "stock";
            this.selectedCapteur.idApiary = "stock";
        } else {
            this.selectedCapteur.idApiary=String(this.selectedRucherEdit);
            this.selectedCapteur.idHive=String(this.selectedRucheEdit);
        }
        
        this.selectedCapteur.description = this.descriptionE;
 
        this.capteurService.updateCapteur(this.selectedCapteur).subscribe(
            data => {},
             ( error => this.errorMsg=error)
        );
        alert("capteur modifié ! ");
        this.resetCapteurEditForm();
        this.editedSensorMsgE=false;
        this.radioRucheE=false;
        this.radioStockE=true;
        this.subscribeToData();
        
    }
/*
    getUserRuchers(){
            this.rucherService.getUserRuchers(this.username).subscribe(
                data => { this.ruchers = data },
                err => console.error(err));
        
    }
*/
    onSelectRucher(event : any) : void{
        this.selectedRucher=event.target.value;
        this.getRucheDuRucher();
        //this.getDetailsRucher();
    }
    
    onSelectRuche(event : any) : void{
        this.selectedRuche=event.target.value;
        this.getRucheDuRucher();
        //this.getDetailsRucher();
    }

    getRucheDuRucher(){
        this.rucherService.getUserRuches(this.username,this.selectedRucher).subscribe(
        data => { this.ruches = data }
        );
    }

    onCancelClicked(){
      this.resetCapteurForm();
      this.editedSensorMsg=false;
      this.editCapteurForm.reset();
    }

    resetCapteurForm(){
        this.newCapteurForm.get('reference').reset();
        this.newCapteurForm.get('type').reset();
        this.newCapteurForm.get('description').reset();
    }

    onCancelClickedE(){
        this.resetCapteurEditForm();
        this.editedSensorMsgE=false;
        this.editCapteurForm.reset();
    }

    resetCapteurEditForm(){
        this.editCapteurForm.get('description').reset();
        this.radioRucheE=false;
        this.radioStockE=true;
    }

    private subscribeToData(): void {
        this.timerSubscription = Observable.timer(200).first().subscribe(() => this.getAllCapteur());
    }



 
}
