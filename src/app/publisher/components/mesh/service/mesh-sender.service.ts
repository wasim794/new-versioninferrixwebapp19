import {AbstractPublisherService, EnvService} from "../../../../core/services";
import {MeshSenderModel} from "../model/mesh-sender.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MeshSenderPointModel} from "../model/mesh-sender-point.model";

@Injectable({providedIn: 'root'})
export class MeshSenderService extends AbstractPublisherService<MeshSenderModel> {

  private _meshSenderPointModel!: MeshSenderPointModel[];
  constructor(http: HttpClient, env: EnvService) {
    super(http, MeshSenderModel, env);
  }

  get meshSenderPointModel(): MeshSenderPointModel[] {
    return this._meshSenderPointModel;
  }

  set meshSenderPointModel(value: MeshSenderPointModel[]) {
    this._meshSenderPointModel = value;
  }
}
