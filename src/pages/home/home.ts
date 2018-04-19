import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RaspyService} from "./raspyService";

enum Servo{
  ELBOW = 0,
  HEAD_PAN,
  NA,//skip unused pin 2
  HEAD_TILT,
  SHOULDER,
  BASE,
  HAND,
  WRIST
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private headPan: number;
  private headTilt: number;
  private armElbow: number;
  private armShoulder: number;
  private armBase: number;
  private armWrist: number;
  private hand: number;

  constructor(public navCtrl: NavController,public raspySvc: RaspyService) {

  }

  onHeadTilt(){
    console.info('Head tilt position = '+this.headTilt);
    this.sendCommand(Servo.HEAD_TILT,this.headTilt);
  }

  onHeadPan(){
    console.info('Head pan position = '+this.headPan);
    this.sendCommand(Servo.HEAD_PAN,this.headPan);
  }

  onArmElbow(){
    console.info('Arm elbow position = '+this.armElbow);
    this.sendCommand(Servo.ELBOW,this.armElbow);
  }

  onArmShoulder(){
    console.info('Arm shoulder position = '+this.armShoulder);
    this.sendCommand(Servo.SHOULDER,this.armShoulder);
  }

  onArmBase(){
    console.info('Arm base position = '+this.armBase);
    this.sendCommand(Servo.BASE,this.armBase);
  }

  onArmWrist(){
    console.info('Arm wrist position = '+this.armWrist);
    this.sendCommand(Servo.WRIST,this.armWrist);
  }

  onHand(){
    console.info('Hand gripper position = '+this.hand);
    this.sendCommand(Servo.HAND,this.hand);
  }

  sendCommand(servo:number,pos:number) {
    let cmd = {
      'servo': servo,
      'pos': this.extrapolatePosition(pos)
    };

    this.raspySvc.postCommand(cmd).subscribe(
      res=> {console.info('rx response from raspi-bot.')},
      err=>{console.info('no word from raspi-bot.')});
  }

  //convert 0-180 degrees to 3000-9000 for servo positions.
  extrapolatePosition(pos:number){
    let nPos: number = 0;
    let offset: number = 33.33333;

    nPos = Math.round(3000+(offset*pos));
    console.info("Extrapolated:"+pos+" -> "+nPos);
    return nPos;
  }

  onRest(){
    this.sendCommand(Servo.HEAD_TILT,180);//get head out of arm's way
    this.sendCommand(Servo.BASE,85);
    this.sendCommand(Servo.SHOULDER,0);
    this.sendCommand(Servo.ELBOW,180);
    this.sendCommand(Servo.WRIST,180);
    this.sendCommand(Servo.HAND,180);//hand open
    this.sendCommand(Servo.HEAD_PAN,75);//center head
    this.sendCommand(Servo.HEAD_TILT,0);//put head down
  }
}
