import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsService } from '../ws.service';
import { Observable } from 'rxjs/Observable';
import { ConfigRoot } from '../types';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html'
})
export class ConfigFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  config: string;

  exampleSchema = {
    'type': 'object',
    'properties': {
      'language': { 'type': 'string', 'enum': [ 'en', 'other' ]  },
      'demoMode': { 'type': 'boolean' },
      'symbol': { 'type': 'string' },
      'priceMergeSize': { 'type': 'number' },
      'maxSize': { 'type': 'number' },
      'minSize': { 'type': 'number' },
      'minTargetProfitPercent': { 'type': 'number' },
      "exitNetProfitRatio": { 'type': 'number' },
      "maxTargetVolumePercent": { 'type': 'number' },
      "iterationInterval": { 'type': 'number' },
      "positionRefreshInterval": { 'type': 'number' },
      "sleepAfterSend": { 'type': 'number' },
      "maxNetExposure": { 'type': 'number' },
      "maxRetryCount": { 'type': 'number' },
      "orderStatusCheckInterval": { 'type': 'number' },
      'stabilityTracker': {
        'type': 'object',
        'properties': {
          'threshold': { 'type': 'number' },
          'recoveryInterval': { 'type': 'number' }
        }
      },
      'onSingleLeg': {
        'type': 'object',
        'properties': {
          'action': { 'type': 'string', 'enum': [ 'Reverse', 'other' ]  },
          'actionOnExit': { 'type': 'string' , 'enum': [ 'Proceed', 'other' ]},
          'options' : {
            'type' : 'object',
            'properties' : {
                   "limitMovePercent": { 'type': 'number' },
                  "ttl": { 'type': 'number' }
            }
          }
        }
      },
      'analytics': {
        'type': 'object',
        'properties': {
          'enabled': { 'type': 'boolean'  },
          'plugin': { 'type': 'string'},
          'initialHistory' : {
            'type' : 'object',
            'properties' : {
                   "minutes": { 'type': 'number' }
            }
          }
        }
      },
      'webGateway': {
        'type': 'object',
        'properties': {
          'enabled': { 'type': 'boolean'  },
          'host': { 'type': 'string'},
          'openBrowser': { 'type': 'boolean'  },
        }
      },
      'brokers': { 
        'type': 'array',
        'items' : {
          'type' : 'object',
          'properties' : {
            "broker": { 'type': 'string' },
            "enabled": { 'type': 'boolean'  },
            "maxLongPosition": { 'type': 'number' },
            "maxShortPosition": { 'type': 'number' },
            "cashMarginType": { 'type': 'string' },
            "commissionPercent": { 'type': 'number' }
          }
        }
       }
    },
    'required': [ 'language' ]
  };

  form = [
    {
      type: "tabs",
      tabs: [
        { 
          title: "General",
          items: [
                    'language',
              'demoMode',
              'symbol',
              'priceMergeSize',
              'maxSize',
              'minSize',
              'minTargetProfitPercent',
              "exitNetProfitRatio",
              "maxTargetVolumePercent",
              "iterationInterval",
              "positionRefreshInterval",
              "sleepAfterSend",
              "maxNetExposure",
              "maxRetryCount",
              "orderStatusCheckInterval",
                  ]
        },
        {
          title: "stabilityTracker",
          items: [
            "stabilityTracker.threshold",
            "stabilityTracker.recoveryInterval"
          ]
        },
        {
          title : "onSingleLeg",
          items: [
            "onSingleLeg.action",
            "onSingleLeg.actionOnExit",
            "onSingleLeg.options.limitMovePercent", 
            "onSingleLeg.options.ttl"
    ]
        },
                {
          title : "analytics",
          items: [
            "analytics.enabled",
            "analytics.plugin",
            "analytics.initialHistory.minutes", 
           ]
        },
                {
          title : "webGateway",
          items: [
              "webGateway.enabled",
                "webGateway.host",
                "webGateway.openBrowser"
          ]
        },
        {
          title: "Brokers",
          type: "array",

          startEmpty: false,
          items : [
            "brokers[].broker",
             "brokers[].enabled",
              "brokers[].maxLongPosition",
               "brokers[].maxShortPosition",
                "brokers[].cashMarginType",
                 "brokers[].commissionPercent",
          ]
        }
      ]
    }
  ];

  exampleData = {};

  displayData: any = null;

  exampleOnSubmitFn(formData) {
    this.config =  JSON.stringify(formData, null, 2);
  }

  constructor(private readonly wsService: WsService) {}

  ngOnInit() {
    this.wsService.connect();
    this.subscription = this.wsService.config$.subscribe(config => {
      //this.exampleData = config;
      this.exampleData = {"language":"en","demoMode":true,"symbol":"BTC/JPY","priceMergeSize":100,"maxSize":0.01,"minSize":0.01,"minTargetProfitPercent":1,"exitNetProfitRatio":20,"maxTargetVolumePercent":50,"iterationInterval":3000,"positionRefreshInterval":5000,"sleepAfterSend":5000,"maxNetExposure":0.1,"maxRetryCount":10,"orderStatusCheckInterval":3000,"stabilityTracker":{"threshold":8,"recoveryInterval":300000},"onSingleLeg":{"action":"Reverse","actionOnExit":"Proceed","options":{"limitMovePercent":5,"ttl":3000}},"analytics":{"enabled":false,"plugin":"SimpleSpreadStatHandler.js","initialHistory":{"minutes":30}},"webGateway":{"enabled":true,"host":"127.0.0.1","openBrowser":true},"brokers":[{"broker":"Coincheck","enabled":true,"maxLongPosition":0.15,"maxShortPosition":0.15,"cashMarginType":"NetOut","commissionPercent":0},{"broker":"Bitflyer","enabled":true,"maxLongPosition":0.03,"maxShortPosition":0,"cashMarginType":"Cash","commissionPercent":0,"noTradePeriods":[["04:00","04:15"]]},{"broker":"Quoine","enabled":true,"maxLongPosition":0.15,"maxShortPosition":0.15,"cashMarginType":"NetOut","leverageLevel":10,"commissionPercent":0},{"broker":"Bitbankcc","npmPath":"@bitr/bitbankcc","enabled":true,"maxLongPosition":0.03,"maxShortPosition":0,"cashMarginType":"Cash","commissionPercent":0},{"broker":"Btcbox","npmPath":"@bitr/btcbox","enabled":true,"maxLongPosition":0.03,"maxShortPosition":0,"cashMarginType":"Cash","commissionPercent":0}]};
      this.config =  JSON.stringify(config, null, 2);
      this.subscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
