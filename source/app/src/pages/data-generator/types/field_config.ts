// https://zhuanlan.zhihu.com/p/87203290
export const FIELD_CONFIG_CN = [{
  typeId:"01",
  typeName:"基本类型",
  subTypes:[{typeId:"0101",typeName:"整型",prefix:"integer",type:"string",eg:""},
            {typeId:"0102",typeName:"字符串",prefix:"string",type:"string",eg:""},
            {typeId:"0103",typeName:"日期",prefix:"date",type:"date",eg:""},
            {typeId:"0104",typeName:"布尔值",prefix:"bool",type:"boolean",eg:""}]
},{
  typeId:"02",
  typeName:"地址相关",
  subTypes:[{typeId:"0201",typeName:"详细地址",prefix:"detailed_address",type:"string",eg:"香港特别行政区大冶县上街钟街k座 664713"},
            {typeId:"0202",typeName:"楼名",prefix:"building_name",type:"string",eg:"V座"},
            {typeId:"0203",typeName:"完整城市名",prefix:"full_city_name",type:"string",eg:""},
            {typeId:"0204",typeName:"城市名称（不带市县）",prefix:"city_name_without_city_county",type:"string",eg:""},
            {typeId:"0205",typeName:"城市后缀名",prefix:"city_suffix",type:"string",eg:""},
            {typeId:"0206",typeName:"国家名称",prefix:"country_name",type:"string",eg:""},
            {typeId:"0207",typeName:"国家编号",prefix:"country_code",type:"string",eg:""},
            {typeId:"0208",typeName:"地区",prefix:"region",type:"string",eg:""},
            {typeId:"0209",typeName:"邮编",prefix:"postal_code",type:"string",eg:""},
            {typeId:"0210",typeName:"省",prefix:"province",type:"string",eg:""},
            {typeId:"0211",typeName:"街道",prefix:"street",type:"string",eg:"广州路"},
            {typeId:"0212",typeName:"街道后缀名",prefix:"street_suffix",type:"string",eg:""}]
},{
  typeId:"03",
  typeName:"汽车相关",
  subTypes:[{typeId:"0301",typeName:"牌照",prefix:"license_plate",type:"string",eg:""}]
},{
  typeId:"04",
  typeName:"银行/信用卡相关",
  subTypes:[{typeId:"0401",typeName:"银行所属国家",prefix:"bank_country",type:"string",eg:"GB"},
            {typeId:"0402",typeName:"基本银行账号",prefix:"basic_bank_account_number",type:"string",eg:""},
            {typeId:"0403",typeName:"国际银行代码",prefix:"international_bank_code",type:"string",eg:""},
            {typeId:"0404",typeName:"过期年月",prefix:"expiration_year_and_month",type:"string",eg:""},
            {typeId:"0405",typeName:"信用卡卡号",prefix:"credit_card_number",type:"string",eg:""},
            {typeId:"0406",typeName:"信用卡提供商",prefix:"credit_card_provider",type:"string",eg:""},
            {typeId:"0407",typeName:"信用卡安全码",prefix:"credit_card_security_code",type:"string",eg:""}]
},{
  typeId:"05",
  typeName:"公司相关",
  subTypes:[{typeId:"0501",typeName:"商业用词",prefix:"business_terms",type:"string",eg:""},
            {typeId:"0502",typeName:"口号",prefix:"slogan",type:"string",eg:""},
            {typeId:"0503",typeName:"公司名称",prefix:"company_name",type:"string",eg:"富罳科技有限公司"},
            {typeId:"0504",typeName:"公司名称前缀",prefix:"company_name_prefix",type:"string",eg:""},
            {typeId:"0505",typeName:"公司名称后缀",prefix:"company_name_suffix",type:"string",eg:""}]
},{
  typeId:"06",
  typeName:"职位相关",
  subTypes:[{typeId:"0601",typeName:"职位",prefix:"position",type:"string",eg:""}]
},{
  typeId:"07",
  typeName:"时间相关",
  subTypes:[{typeId:"0701",typeName:"AM/PM",prefix:"am",type:"string",eg:""},
            {typeId:"0702",typeName:"日期字符串（YYYY-MM-DD）",prefix:"date_string",type:"string",eg:""},
            {typeId:"0703",typeName:"日期字符串（YYYY-MM-DD）(过去)",prefix:"date_string_past",type:"string",eg:""},
            {typeId:"0704",typeName:"日期字符串（YYYY-MM-DD）(将来)",prefix:"date_string_future",type:"string",eg:""},
            {typeId:"0705",typeName:"日期",prefix:"date",type:"date",eg:""},
            {typeId:"0706",typeName:"日期和时间",prefix:"date_and_time",type:"datetime",eg:""},
            {typeId:"0707",typeName:"日期（过去）",prefix:"date_past",type:"date",eg:""},
            {typeId:"0708",typeName:"日期和时间",prefix:"date_and_time",type:"datetime",eg:""},
            {typeId:"0709",typeName:"日期（将来）",prefix:"date_future",type:"date",eg:""},
            {typeId:"0710",typeName:"日期和时间",prefix:"date_and_time",type:"datetime",eg:""}]
},{
  typeId:"08",
  typeName:"文件相关",
  subTypes:[{typeId:"0801",typeName:"文件扩展名",prefix:"file_extension",type:"string",eg:""},
            {typeId:"0802",typeName:"文件全名",prefix:"file_full_name",type:"string",eg:""},
            {typeId:"0803",typeName:"文件路径",prefix:"file_path",type:"string",eg:""},
            {typeId:"0804",typeName:"文件路径+文件全名",prefix:"file_path",type:"string",eg:""}]
},{
  typeId:"09",
  typeName:"网络相关",
  subTypes:[{typeId:"0901",typeName:"企业邮箱",prefix:"corporate_email",type:"string",eg:""},
            {typeId:"0902",typeName:"个人邮箱",prefix:"personal_email",type:"string",eg:""},
            {typeId:"0903",typeName:"域名",prefix:"domain_name",type:"string",eg:""},
            {typeId:"0904",typeName:"二级域名",prefix:"subdomain",type:"string",eg:""},
            {typeId:"0905",typeName:"主机名",prefix:"hostname",type:"string",eg:""},
            {typeId:"0906",typeName:"URL",prefix:"url",type:"string",eg:""},
            {typeId:"0907",typeName:"IPV4",prefix:"ipv4",type:"string",eg:""},
            {typeId:"0908",typeName:"IPV6",prefix:"ipv6",type:"string",eg:""},
            {typeId:"0909",typeName:"MAC地址",prefix:"mac_address",type:"string",eg:""}]
},{
  typeId:"10",
  typeName:"人物相关",
  subTypes:[{typeId:"1001",typeName:"姓名",prefix:"name",type:"string",eg:""},
            {typeId:"1002",typeName:"姓名（女）",prefix:"female_name",type:"string",eg:""},
            {typeId:"1003",typeName:"姓名（男）",prefix:"male_name",type:"string",eg:""},
            {typeId:"1004",typeName:"姓",prefix:"last_name",type:"string",eg:""},
            {typeId:"1005",typeName:"名",prefix:"first_name",type:"string",eg:""}]
},{
  typeId:"11",
  typeName:"证件相关",
  subTypes:[{typeId:"1101",typeName:"身份证",prefix:"id_card",type:"string",eg:""},
            {typeId:"1102",typeName:"护照",prefix:"passport",type:"string",eg:""},
            {typeId:"1103",typeName:"驾照",prefix:"driver_license",type:"string",eg:""}]
},{
  typeId:"12",
  typeName:"电话相关",
  subTypes:[{typeId:"1201",typeName:"完整手机号码（包含国家和国内区号）",prefix:"complete_phone_number",type:"string",eg:""},
            {typeId:"1202",typeName:"手机号",prefix:"mobile_number",type:"string",eg:""},
            {typeId:"1203",typeName:"座机号",prefix:"landline_number",type:"string",eg:""},
            {typeId:"1204",typeName:"区号",prefix:"area_code",type:"string",eg:""}]
} 
];

export const LANG = [
"ar_EG - Arabic (Egypt)",
"ar_PS - Arabic (Palestine)",
"ar_SA - Arabic (Saudi Arabia)",
"bg_BG - Bulgarian",
"bs_BA - Bosnian",
"cs_CZ - Czech",
"de_DE - German",
"dk_DK - Danish",
"el_GR - Greek",
"en_AU - English (Australia)",
"en_CA - English (Canada)",
"en_GB - English (Great Britain)",
"en_NZ - English (New Zealand)",
"en_US - English (United States)",
"es_ES - Spanish (Spain)",
"es_MX - Spanish (Mexico)",
"et_EE - Estonian",
"fa_IR - Persian (Iran)",
"fi_FI - Finnish",
"fr_FR - French",
"hi_IN - Hindi",
"hr_HR - Croatian",
"hu_HU - Hungarian",
"hy_AM - Armenian",
"it_IT - Italian",
"ja_JP - Japanese",
"ka_GE - Georgian (Georgia)",
"ko_KR - Korean",
"lt_LT - Lithuanian",
"lv_LV - Latvian",
"ne_NP - Nepali",
"nl_NL - Dutch (Netherlands)",
"no_NO - Norwegian",
"pl_PL - Polish",
"pt_BR - Portuguese (Brazil)",
"pt_PT - Portuguese (Portugal)",
"ro_RO - Romanian",
"ru_RU - Russian",
"sl_SI - Slovene",
"sv_SE - Swedish",
"tr_TR - Turkish",
"uk_UA - Ukrainian",
"zh_CN - Chinese (China Mainland)",
"zh_TW - Chinese (China Taiwan)"
]

export const RANDOM_TYPE = [
  {id:"int", name:"整数", probability: 35},
  {id:"string", name:"字符串", probability: 35},
  {id:"text", name:"文本", probability: 15},
  {id:"datetime", name:"日期和时间", probability: 0},
  {id:"decimal", name:"DECIMAL", probability: 4},
  {id:"smallint", name:"SMALLINT", probability: 4},
  {id:"char", name:"字符", probability: 3},
  {id:"date", name:"日期", probability: 0},
  {id:"time", name:"时间", probability: 1},
  {id:"timestamp", name:"时间戳", probability: 0}
]

export const PARAM_CONFIG = {
  prefix: "demo",
  tableNum: 50,
  rowNum: 100,
  colNum: 100,
  minLength: 3,
  maxLength: 15,
  maxIntLength: 5,
  maxDecimalLength: 5,
  startDate: "1970-01-01",
  endDate: "2050-12-31",
  // outputType: "Cloud",
  // outputFormat: "excel"
}

export const OUTPUT_CONFIG = {
  outputType: "Cloud",
  outputFormat: "",
  targetService: null,
  targetAccount: null,
  targetRegion: null,
  targetInstance: null,
  targetEndpoint: null,
  credentialType: "userpwd", // "userpwd|secret"
  credentialUsername: null,
  credentialPassword: null,
  credentialSecretId: null
}
