import React, { useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Button, Card, Portal } from 'react-native-paper';
import { UseMutationResult, UseQueryResult } from 'react-query';
import { baseUrl } from '../api/Api';
import { colors } from '../theme/colors';
interface props {
    files: Array<string>;
    id_service: string;
    isScrollView?: {
        Files: UseQueryResult<{ files: string[]; }, unknown>
        deleteFileM?: UseMutationResult<{ isDeleted: boolean; }, unknown, { id_service: string; file: string; }, void>;
    };
}
export const CardImage = ({ files, id_service, isScrollView }: props) => {
    const [imageSelected, setimageSelected] = useState<string>('');

    return (
        <>
            {
                (isScrollView)
                    ?
                    <ScrollView refreshControl={<RefreshControl refreshing={isScrollView.Files.isFetching} onRefresh={() => isScrollView.Files.refetch()} />}>
                        {files.map(file => <ImageFormat key={file} file={file} id={id_service} setimageSelected={setimageSelected} deleteFileM={isScrollView.deleteFileM} />)}
                    </ScrollView>
                    :
                    <View>
                        {files.map(file => <ImageFormat key={file} file={file} id={id_service} setimageSelected={setimageSelected} />)}
                    </View>
            }
            {
                (imageSelected !== '') && <Portal>
                    <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.8)', justifyContent: 'center', paddingHorizontal: 15 }} onPress={() => setimageSelected('')}>
                        <Image source={{ uri: imageSelected }} resizeMode='contain' style={{ width: '100%', height: '80%' }} />
                    </Pressable>
                </Portal>
            }
        </>
    )
};

interface propsFormat {
    file: string;
    id: string;
    setimageSelected: React.Dispatch<React.SetStateAction<string>>;
    deleteFileM?: UseMutationResult<{ isDeleted: boolean; }, unknown, { id_service: string; file: string; }, void>;
}

const ImageFormat = ({ file, deleteFileM, setimageSelected, id }: propsFormat) => (
    <Card style={{ marginTop: 15 }} elevation={10} key={file}>
        <Card.Cover resizeMode='cover' resizeMethod='resize' total={500} source={{ uri: `${baseUrl}/files/getImg?type=Service&id=${id}&img=${file}` }} />
        <Card.Actions style={{ backgroundColor: colors.background }}>
            {(deleteFileM) && <Button color={colors.Primary} icon={'delete'} onPress={() => deleteFileM.mutate({ id_service: `${id}`, file: file })} >Delete</Button>}
            <Button color={colors.Primary} icon={'fullscreen'} onPress={() => {
                setimageSelected(`${baseUrl}/files/getImg?type=Service&id=${id}&img=${file}`)
            }}>Ver</Button>
        </Card.Actions>
    </Card>
)
