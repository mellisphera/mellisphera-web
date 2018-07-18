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

  types : any[] = []; 

  radioStock :boolean;
  radioRuche : boolean;
  
  message="";
  editedSensorMsg :boolean;
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
                            'description': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(400)])],
                            'selectedRucher': [null],
                            'selectedRuche': [null],
                            'checkbox': [],
                            'validate' : ``
                        })                
                
        this.editCapteurForm=formBuilder.group({
                            'selectedRucher': [null],
                            'selectedRuche': [null,Validators.compose([Validators.required])],
                            'checkbox': [],
                            'validate' : ``
                        })                
        this.username= data.currentUser().username;
        
    }


    ngOnInit() {
        this.getUserRuchers(); 
        this.getAllCapteur();
        this.selectRadioStock();
}

    selectRadioStock(){
        console.log("radio stock : " + this.radioStock);
        console.log("radio stock : " + this.radioRuche);
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

        console.log("radio stock : " + this.radioStock);
        console.log("radio ruche : " + this.radioRuche);

        this.newCapteurForm.get('selectedRuche').setValidators([Validators.required]);
        this.newCapteurForm.get('selectedRuche').updateValueAndValidity();
    }




    capteurForm(){
        this._router.navigate(['/nouveau-capteur']);
    }

    getAllCapteur(){
        console.log("this username :"+  this.username);
       
        this.capteurService.getUserCapteurs(String(this.username)).subscribe(
          data => {this.capteurs=data;},
          err  => {console.log(err)},
          () => console.log('done loading sensors')
        );
       
    }

    selectCapteur(capteur){
        this.selectedCapteur=capteur;
    }


    checkCapteurType(value : any){
        
    console.log("value :"+  value);
       
            this.capteurService.checkCapteurType(value).subscribe(
                data =>{ 
                    this.types=data;
                },
                ( error => this.errorMsg=error)
               );
    }
    string(){
     //   this.test= this.capteurService.string();
    }

   //CREATE CAPTEUR
    createCapteur(capteur){
        this.capteur.reference=this.reference;
        this.capteur.type=this.newCapteurForm.controls['type'].value;
        this.capteur.description=this.description;
        var idRuche = String(this.selectedRuche);
        this.capteur.idHive = idRuche;
        this.capteur.idApiary = String(this.selectedRucher);
        this.capteur.username = this.username;

        if(this.radioStock==true){
            this.capteur.idHive = "stock";
            this.capteur.idApiary = "stock";
        }


        this.capteurService.createCapteur(this.capteur).subscribe( 
            ( error => this.errorMsg=error)
        );
       
        this.resetCapteurForm();
        //location.reload();
        this.radioRuche=false;
        this.radioStock=true;
        
        alert("Votre Capteur a été créé");
        this.subscribeToData();
    }  

    resetCapteurForm(){
        this.newCapteurForm.get('reference').reset();
        this.newCapteurForm.get('type').reset();
        this.newCapteurForm.get('description').reset();
    }
    //DELETE CAPTEUR

    deleteCapteur(capteur){
        this.selectedCapteur = capteur;
        if (confirm("Are you sure you want to delete " + this.selectedCapteur.reference + "?")) {
          this.capteurService.deleteCapteur(this.selectedCapteur )
            .subscribe(
              err => {
               
              });
        }
        this.subscribeToData();
     
    }

    updateCapteur(){
      
        this.selectedCapteur.idApiary=String(this.selectedRucher);
        this.selectedCapteur.idHive=String(this.selectedRuche);
 
        this.capteurService.updateCapteur(this.selectedCapteur).subscribe(
            data => { 
                alert("capteur modifié ! ");
             },
             ( error => this.errorMsg=error)
        );
        this.editedSensorMsg=true;
        
        this.editCapteurForm.reset();
        
        this.subscribeToData();
        
    }

    getUserRuchers(){
        console.log("this username :"+  this.username);
        
            this.rucherService.getUserRuchers(this.username).subscribe(
                data => { this.ruchers = data },
                err => console.error(err),
                () => console.log('done loading ruchers')
            );
        
    }

    onSelectRucher(event : any) : void{
        this.selectedRucher=event.target.value;
        console.log("Selected Rucher : "+ this.selectedRucher);
        this.getRucheDuRucher();
        //this.getDetailsRucher();
    }
    
    onSelectRuche(event : any) : void{
        this.selectedRuche=event.target.value;
        console.log("L'ID de la ruche selectionnée : "+ this.selectedRuche);
        this.getRucheDuRucher();
        //this.getDetailsRucher();
    }

    getRucheDuRucher(){
        console.log("this username :"+  this.username);
        this.rucherService.getUserRuches(this.username,this.selectedRucher).subscribe(
        data => { this.ruches = data },
        
        () => console.log('Done loading RUCHES ')
        );
    }

    onCancelClicked(){
      this.resetCapteurForm();
      this.editedSensorMsg=false;
      this.editCapteurForm.reset();
    }

    private subscribeToData(): void {
        this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.getAllCapteur());
    }



 
}
