import { Link } from 'react-router-dom'

import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
    SlideFade,
    Flex,
} from '@chakra-ui/react'

const Home = () => {
    return (
        <>
            <Flex minH="calc(100vh - 60px)" align="center" justify="center">
                <SlideFade
                    offsetY={'-100px'}
                    in={true}
                    transition={{ enter: { duration: 0.3 } }}
                >
                    <Container maxW={'3xl'}>
                        <Stack
                            as={Box}
                            textAlign={'center'}
                            spacing={{ base: 8, md: 14 }}
                            py={{ base: 20, md: 36 }}
                        >
                            <Heading
                                fontWeight={600}
                                fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                                lineHeight={'110%'}
                            >
                                Portal de Vacinação <br />
                                <Text as={'span'} color={'#d03e35'}>
                                    Pitang
                                </Text>
                            </Heading>
                            <Text color={'gray.500'}>
                                Nossa cidade está se mobilizando para garantir
                                que todos recebam a vacina contra a COVID-19.
                                Utilize nosso portal para agendar sua vacinação
                                de forma rápida e segura. Verifique os horários
                                disponíveis e garanta sua dose para proteger a
                                si mesmo e aos outros.
                            </Text>
                            <Stack
                                direction={'column'}
                                spacing={3}
                                align={'center'}
                                alignSelf={'center'}
                                position={'relative'}
                            >
                                <Button
                                    as={Link}
                                    to="/vaccine-appointment"
                                    colorScheme={'green'}
                                    bg={'#da4c44'}
                                    rounded={'full'}
                                    px={6}
                                    _hover={{
                                        bg: '#d03e35',
                                    }}
                                >
                                    Agende sua vacina
                                </Button>
                            </Stack>
                        </Stack>
                    </Container>
                </SlideFade>
            </Flex>
        </>
    )
}
export default Home
