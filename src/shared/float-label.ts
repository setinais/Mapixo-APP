import {Component, ElementRef, Input, Output, ViewChild} from "@angular/core";
import { Color } from "tns-core-modules/color";

@Component({
    selector: "FloatLabel",
    moduleId: module.id,
    template: `
        <GridLayout rows="30, auto" marginBottom="5">
            <Label #label row="1" [text]="placeholder" opacity="0.4" fontSize="14"  class="input fas"></Label>
            <TextField #textField [secure]="secure" [isEnabled]="disabled" [(ngModel)]="value" row="1"  (focus)="onFocus()" (blur)="onBlur()" borderBottomWidth="3"  [borderBottomColor]="borderBottomColor" padding="2" ></TextField>
        </GridLayout>
    `
})
export class FloatLabel {
    @Input() placeholder: string;
    @Input() secure: boolean;
    @Input() borderBottomColor: string;
    @ViewChild("label", {static: false}) label: ElementRef;
    @ViewChild("textField", {static: false}) textField: ElementRef;

    public value: string
    public hasError: boolean
    public disabled: boolean = true
    constructor() {
        this.hasError = false;
        this.value = ""
    }

    ngOnInit(): void {
    }

    onFocus() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        // animate the label sliding up and less transparent.
        label.animate({
            translate: { x: 0, y: - 25 },
            opacity: 1,
        }).then(() => { }, () => { });

        // set the border bottom color to green to indicate focus
        if(this.hasError){
            textField.borderBottomColor = new Color('#ff0004')
        }else{
            textField.borderBottomColor = new Color('#000000');
        }
    }

    onBlur() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        // if there is text in our input then don't move the label back to its initial position.
        if (!textField.text) {
            label.animate({
                translate: { x: 0, y: 0 },
                opacity: 0.4
            }).then(() => { }, () => { });
        }
        // reset border bottom color.
        if(this.hasError){
            textField.borderBottomColor = new Color('#ff0004')
        } else {
            textField.borderBottomColor = new Color(this.borderBottomColor);
        }
    }

    onError(){
        this.hasError = true
        const textField = this.textField.nativeElement;
        textField.borderBottomColor = new Color('#ff0004')
    }

    onDisabled(){
        this.disabled = !this.disabled
    }
}
