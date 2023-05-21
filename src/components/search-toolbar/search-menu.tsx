import { TextField, Autocomplete, Box, IconButton, createFilterOptions } from "@mui/material"
import { useAppContext } from "../../middleware/context-provider";
import "./search-menu.css"
import { LngLat } from "../../types";


export const SearchMenu = ({ datos }: any) => {

    const dispatch = useAppContext()[1];

    const handleChange = (event: React.SyntheticEvent, value: any) => {
        const coordenadas: LngLat = { lat: value.lat, lng: value.lng };
        dispatch({ type: "GOTO_ASSET", payload: coordenadas });
    }

    const filterOptions = (datos: any, state: { inputValue: string }) => {
        const filteredOptions = datos.filter((data: any) => {

            const optionLabel = data.name.toLowerCase() + data.uid.toLowerCase();
            const removeAccentsOL = optionLabel.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const inputText = state.inputValue.toLowerCase();
            const removeAccentsIT = inputText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const inputTerms = removeAccentsIT.split(" ");
            return inputTerms.every((term) => removeAccentsOL.includes(term));
        });

        return filteredOptions;
    };

    return (
        <div className="search-menu">
            <Autocomplete sx={{
                background: "#FFF",
                width: 250,
            }}

                isOptionEqualToValue={(option, value) => option.id === value.id}
                disablePortal
                id="fly-to-asset"
                options={datos || []}
                filterOptions={filterOptions}
                autoHighlight
                blurOnSelect
                onChange={(e, datos) => handleChange(e, datos)}
                getOptionLabel={(data) => data?.name || ''}

                renderOption={(props: object, data: any) => (
                    <Box component="li"
                        {...props}
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }} >
                        <img
                            loading="lazy"
                            width="20"
                            src={`./${data.tipo}.png`}
                            alt=""
                        />
                        <div className="options">{data.name}
                            <div className="sub-options">{data.uid}</div>
                        </div>

                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        sx={{
                            '& .MuiAutocomplete-input, & .MuiInputLabel-root': {
                                fontSize: 14,
                                height: 16,
                                margin: 0,
                            }
                        }}
                        label="Buscar"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
            />
        </div>
    );
};