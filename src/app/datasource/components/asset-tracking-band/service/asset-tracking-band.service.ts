import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {AssetTrackingBandDatasourceModel} from "../model/asset-tracking-band-datasource.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AssetTrackingBandService extends AbstractDataSourceService<AssetTrackingBandDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, AssetTrackingBandDatasourceModel, env);
  }
}
