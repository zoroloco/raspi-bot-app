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
  step: number = 5;
  headPanMin: number=0;
  headPanMax: number=180;
  headTiltMin: number=0;
  headTiltMax: number=180;
  armBaseMin: number=0;
  armBaseMax: number=180;
  armShoulderMin: number=0;
  armShoulderMax: number=180;
  armElbowMin: number=0;
  armElbowMax: number=180;
  armWristMin: number=0;
  armWristMax: number=180;

  headPan: number;
  headTilt: number;
  armElbow: number;
  armShoulder: number;
  armBase: number;
  armWrist: number;
  hand: number;

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

  onSleep(){
    this.sendCommand(Servo.HEAD_TILT,180);//put head down

    this.armBase = 85;
    this.headPan = 75;
    this.armShoulder = 0;
    this.armElbow = 180;
    this.armWrist = 180;
    this.hand = 0;
    this.headTilt = 0;

    this.onArmBase();
    this.onHeadPan();
    this.onArmShoulder();
    this.onArmElbow();
    this.onArmWrist();
    this.onHand();
    this.onHeadTilt();
  }

    onWakeUp(){
        this.sendCommand(Servo.HEAD_TILT,180);//put head down

        this.armBase = 85;
        this.headPan = 75;
        this.armShoulder = 0;
        this.armElbow = 180;
        this.armWrist = 180;
        this.hand = 0;
        this.headTilt = 90;

        this.onArmBase();
        this.onHeadPan();
        this.onArmShoulder();
        this.onArmElbow();
        this.onArmWrist();
        this.onHand();
        this.onHeadTilt();
    }
}
