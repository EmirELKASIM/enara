import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { Translation } from '../../../../../src/sevices/translation';
import { Payload } from './IPayloadParams';


@Component({
  selector: 'app-general-info',
  imports: [
    MatCheckboxModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  templateUrl: './general-info.html',
  styleUrl: './general-info.css',
})
export default class GeneralInfo {
  support = '';
  pressure = '';
  psychologicalSafety = '';
  numberIndividuals = '';
  whoParticipating = '';
  reasonForConsultation = '';
  whatHappeningFamily = '';
  purposeSessions = '';
  childAge = '';
  reasonForAssistance = '';
  school = '';
  psychologicalSafetyForChild = '';
  translate = inject(Translation);
  private readonly _formBuilder = inject(FormBuilder);
  readonly whySeekingAdvice = this._formBuilder.group({
    anxiety: false,
    depression: false,
    psychologicalPressure: false,
    relationshipProblems: false,
    shock: false,
    anotherReason: false,
  });
  readonly howFeelingLately = this._formBuilder.group({
    difficultySleeping: false,
    overwork: false,
    poorConcentration: false,
    moodSwings: false,
    panicAttacks: false,
    noneAbove: false,
  });
  readonly behaviorAndFeelings = this._formBuilder.group({
    moodSwings: false,
    frequentCrying: false,
    aggression: false,
    excessiveAttachment: false,
    sleepProblems: false,
  });
  @Input() sendMeetingType!: string;
  @Output() sendAccepted = new EventEmitter<Payload>();
  @Output() isAccepted = new EventEmitter<boolean>();
  private isIndividualSessionValid(): boolean {
    const advice = this.whySeekingAdvice.value;
    const feeling = this.howFeelingLately.value;

    const hasWhyAdvice = Object.values(advice).some((v) => v);
    const hasFeeling = Object.values(feeling).some((v) => v);

    return (
      !!this.support &&
      !!this.pressure &&
      !!this.psychologicalSafety &&
      hasWhyAdvice &&
      hasFeeling
    );
  }

  private isCouplesSessionValid(): boolean {
    return (
      !!this.numberIndividuals &&
      !!this.whoParticipating &&
      !!this.reasonForConsultation &&
      !!this.whatHappeningFamily &&
      !!this.purposeSessions
    );
  }

  private isChildrenSessionValid(): boolean {
    const behavior = this.behaviorAndFeelings.value;
    const hasBehavior = Object.values(behavior).some((v) => v);

    return (
      !!this.childAge &&
      !!this.reasonForAssistance &&
      !!this.school &&
      !!this.psychologicalSafetyForChild &&
      hasBehavior
    );
  }
  public checkAll(): boolean {
    if (
      this.isIndividualSessionValid() ||
      this.isCouplesSessionValid() ||
      this.isChildrenSessionValid()
    ) {
      return true;
    }
    return false;
  }
  onSubmit() {
    let isValid = false;

    if (this.sendMeetingType === 'individualSession') {
      isValid = this.isIndividualSessionValid();
      if (!isValid) {
        this.isAccepted.emit(false);
        return;
      }

      // === إرسال البيانات ===
      const whyAdvice: string[] = [];
      Object.entries(this.whySeekingAdvice.value).forEach(
        ([key, value]) => value && whyAdvice.push(key),
      );

      const feelingLately: string[] = [];
      Object.entries(this.howFeelingLately.value).forEach(
        ([key, value]) => value && feelingLately.push(key),
      );

      this.sendAccepted.emit({
        support: this.support,
        pressure: this.pressure,
        psychologicalSafety: this.psychologicalSafety,
        whySeekingAdvice: whyAdvice,
        howFeelingLately: feelingLately,
      });
    } else if (this.sendMeetingType === 'couplesSession') {
      isValid = this.isCouplesSessionValid();
      if (!isValid) {
        this.isAccepted.emit(false);
        return;
      }

      this.sendAccepted.emit({
        numberIndividuals: this.numberIndividuals,
        whoParticipating: this.whoParticipating,
        reasonForConsultation: this.reasonForConsultation,
        whatHappeningFamily: this.whatHappeningFamily,
        purposeSessions: this.purposeSessions,
      });
    } else if (
      this.sendMeetingType === 'childrensSession' ||
      this.sendMeetingType === 'teenagersSession'
    ) {
      isValid = this.isChildrenSessionValid();
      if (!isValid) {
        this.isAccepted.emit(false);
        return;
      }

      const behaviorFeelings: string[] = [];
      Object.entries(this.behaviorAndFeelings.value).forEach(
        ([key, value]) => value && behaviorFeelings.push(key),
      );

      this.sendAccepted.emit({
        childAge: this.childAge,
        reasonForAssistance: this.reasonForAssistance,
        behaviorAndFeelings: behaviorFeelings,
        school: this.school,
        psychologicalSafetyForChild: this.psychologicalSafetyForChild,
      });
    }

    this.isAccepted.emit(true);
  }
}
