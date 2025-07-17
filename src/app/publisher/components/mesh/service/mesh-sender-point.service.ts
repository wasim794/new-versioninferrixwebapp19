import {AbstractPublishedPointService, EnvService} from "../../../../core/services";
import {MeshSenderPointModel} from "../model/mesh-sender-point.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class MeshSenderPointService extends AbstractPublishedPointService<MeshSenderPointModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, MeshSenderPointModel, env);
  }
}
