$(document).ready(function() {

    $("#buyerDelivery").change(function() { refresh(); });
    $("#buyerPickupPoint").change(function() { refresh(); });
    $("#sellerDisAssembly").change(function () { refresh(); });
    $("#sellerType").change(function () { refresh(); });

    function refresh() {

        if ($("#sellerType").val() == "shop") {
            $("#merchantSettingBlock").show();
        } else {
            $("#merchantSettingBlock").hide();
        }

        if ($("#buyerDelivery").val() == "selfPickup") {
            $("#decisionOnSelfPickupCard").show();
            $("#decisionOnDeliveryCard").hide();
            $("#pickupPointBlock").hide();
            $("#deliverSettingBlock, #_deliverSettingBlock").hide();
            $("#partnerSettingBlock, #_partnerSettingBlock").hide();
        } else {
            $("#decisionOnSelfPickupCard").hide();
            $("#decisionOnDeliveryCard").show();
            $("#pickupPointBlock").show();
            $("#deliverSettingBlock, #_deliverSettingBlock").show();
            if ($("#buyerPickupPoint").val() == "selected") {
                $("#decisionOnDelivery option[value=returnAfterAssemble]").show();
                $("#decisionOnDelivery option[value=technicalReturn]").show();
                $("#decisionOnDelivery option[value=basicReturn]").show();
                $("#partnerSettingBlock, #_partnerSettingBlock").show();
            } else {
                $("#decisionOnDelivery").val("buy").change();
                $("#decisionOnDelivery option[value=returnAfterAssemble]").hide();
                $("#decisionOnDelivery option[value=technicalReturn]").hide();
                $("#decisionOnDelivery option[value=basicReturn]").hide();
                $("#partnerSettingBlock, #_partnerSettingBlock").hide();
            }
        }

        if ($("#sellerDisAssembly").is(":checked")) {
            $("#sellerAssemblyPriceBlock").hide();
        } else {
            $("#sellerAssemblyPriceBlock").show();
        }

    }

    refresh();

});