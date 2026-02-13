// Navigation
const sidebarButtons = document.querySelectorAll(".sidebar-btn");
const tabContents = document.querySelectorAll(".tab-content");
sidebarButtons.forEach(sidebarButton => {
    sidebarButton.addEventListener("click", () => {
        sidebarButtons.forEach(sidebarBtn => sidebarBtn.classList.remove("active"));
        tabContents.forEach(tabContent => tabContent.classList.remove("active"));
        sidebarButton.classList.add("active");
        document.getElementById(sidebarButton.dataset.tab)
            .classList.add("active");
    });
});

// Calculations
const path = {
    valley4: {
        stations: ["refugee_camp", "infra_station", "reconstruction_hq"],
        products: ["buck_capsule_a", "hc_valley_battery", "sc_valley_battery", "buck_capsule_b", "buck_capsule_c", "amethyst_bottle", "amethyst_part", "origocrust", "lc_valley_battery", "ferrium_part", "steel_part"]
    },
    wuling: {
        stations: ["sky_king_flats_construction_site"],
        products: ["lc_wuling_battery", "yazhen_syringe_c", "xiranite"]
    }
};

const batteryType = {
    valley4: ["valley4_originium_ore", "lc_valley_battery", "sc_valley_battery", "hc_valley_battery"],
    wuling: ["wuling_originium_ore", "lc_wuling_battery"]
}

function update() {
    Object.keys(path).forEach(region => {
        // Region Gain Estimates
        let regionEstimates = 0;
        path[region].stations.forEach(station => {
            const earningEfficiency = Number(document.getElementById(`${region}-${station}-earning_efficiency`).textContent) || 0;
            const bonusEarningChance = Number(document.getElementById(`${region}-${station}-bonus_earning_chance`).value) || 0;
            const stationEstimates = earningEfficiency * (1 + bonusEarningChance / 100);
            document.getElementById(`${region}-${station}-earning_estimates`).textContent = stationEstimates.toFixed(0);
            regionEstimates += stationEstimates;
        });
        document.getElementById(`${region}-earning_estimates`).textContent = regionEstimates.toFixed(0);

        // Stock Bill Coverage
        let stockBillCoverage = 0;
        path[region].products.forEach(product => {
            const factoriesNum = Number(document.getElementById(`${region}-${product}-factories_num`).value) || 0;
            const _1Output = Number(document.getElementById(`${region}-${product}-1_output`).textContent) || 0;
            const productOutput = factoriesNum * _1Output;
            document.getElementById(`${region}-${product}-output`).textContent = productOutput;

            const price = Number(document.getElementById(`${region}-${product}-price`).textContent) || 0;
            const stockBillIncomePerMinute = factoriesNum * price * _1Output;
            document.getElementById(`${region}-${product}-income_per_minute`).textContent = stockBillIncomePerMinute;

            const stockBillIncomePerHour = stockBillIncomePerMinute * 60;
            document.getElementById(`${region}-${product}-income_per_hour`).textContent = stockBillIncomePerHour;
            stockBillCoverage += stockBillIncomePerHour;
        });
        document.getElementById(`${region}-coverage`).textContent = stockBillCoverage;
        document.getElementById(`${region}-percent_covered`).textContent = regionEstimates
            ? (stockBillCoverage / regionEstimates * 100).toFixed(2)
            : 0;

        // Ore Consumption
        let regionFactoriesNum = 0;
        path[region].products.forEach(product => {
            const factoriesNum = Number(document.getElementById(`${region}-${product}-factories_num`).value) || 0;
            regionFactoriesNum += factoriesNum;

            const _1CostOriginium = Number(document.getElementById(`${region}-${product}-1_cost-originium`).textContent);
            const _1CostAmethyst = Number(document.getElementById(`${region}-${product}-1_cost-amethyst`).textContent);
            const _1CostFerrium = Number(document.getElementById(`${region}-${product}-1_cost-ferrium`).textContent);
            const costOriginium = _1CostOriginium * factoriesNum;
            const costAmethyst = _1CostAmethyst * factoriesNum;
            const costFerrium = _1CostFerrium * factoriesNum;
            document.getElementById(`${region}-${product}-n_cost-originium`).textContent = costOriginium;
            document.getElementById(`${region}-${product}-n_cost-amethyst`).textContent = costAmethyst;
            document.getElementById(`${region}-${product}-n_cost-ferrium`).textContent = costFerrium;
        });
        document.getElementById(`${region}-factories_num`).textContent = regionFactoriesNum;

        // Battery Consumption
        Object.keys(batteryType).forEach(batteryRegion => {
            batteryType[batteryRegion].forEach(batteryProduct => {
                if (
                    !document.getElementById(`${batteryRegion}-${batteryProduct}-consumption`) ||
                    !document.getElementById(`${batteryRegion}-${batteryProduct}-output`)
                ) return;

                const thermalBankCount = Number(document.getElementById(`${batteryRegion}-${batteryProduct}-thermal_bank_count`).value);
                const consumptionSpeed = Number(document.getElementById(`${batteryRegion}-${batteryProduct}-consumption_speed`).textContent);
                const consumption = thermalBankCount * consumptionSpeed;
                const output = Number(document.getElementById(`${batteryRegion}-${batteryProduct}-output`).textContent) || 0;
                document.getElementById(`${batteryRegion}-${batteryProduct}-consumption`).textContent = consumption;
                document.getElementById(`${batteryRegion}-${batteryProduct}-output`).textContent = output - consumption;
            });
        });
    });
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", update);
});

update();
